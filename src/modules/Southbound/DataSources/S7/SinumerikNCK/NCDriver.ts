import net from 'net';
import winston from 'winston';
import { NC_ADDRESSES } from './NCAddresses';
import { NCVarSelectorAddress, NCItem } from './interfaces';

enum ConnectionState {
  INVALID = 0,
  NOT_CONNECTED = 1,
  TCP_CONNECTED = 2,
  ISO_CONNECTED = 3,
  PDU_NEGOTIATED = 4,
  FIRST_VALID_RESPONSE_RECEIVED = 5
}

enum NCVarDataType {
  INVALID = 0,
  WORD = 0x4,
  DWORD = 0x6,
  DINT = 0x7,
  DOUBLE = 0xf,
  STRING = 0x13
}

enum ItemStatusCode {
  RESERVED = 0x00,
  HARDWARE_FAULT = 0x01,
  NOT_ALLOWED = 0x03,
  ADDRESS_OUT_OF_RANGE = 0x05,
  DATA_TYPE_NOT_SUPPORTED = 0x06,
  DATA_TYPE_INCONSISTENT = 0x07,
  OBJECT_DOES_NOT_EXIST = 0x0a,
  SUCCESS = 0xff
}

enum Exchange {
  NONE,
  READ_OBJECT_LEVEL
}

interface NCKObjectLevel {
  objectId: number;
  level: number;
  emphasedObjectResult: number;
  rpm: number;
  status: number;
}

/**
 * Implements an driver to read data from an SIEMENS SINUMERIK NCKxxx (Reference Model: NCK100 / NCK001),
 * currently reading objects (preprocessed vibration KPIs) is supported.
 */
export default class SinumerikNCKProtocolDriver {
  private timeout: number = 60000;
  private tcpClient: any;

  private connectionState = ConnectionState.NOT_CONNECTED;
  private ISO_CONNECT_REQUEST = Buffer.from([
    0x03, 0x00, 0x00, 0x16, 0x11, 0xe0, 0x00, 0x00, 0x00, 0x02, 0x00, 0xc0,
    0x01, 0x0a, 0xc1, 0x02, 0x01, 0x00, 0xc2, 0x02, 0x01, 0x02
  ]);
  private ISO_NEGOTIATE_PDU = Buffer.from([
    0x03, 0x00, 0x00, 0x19, 0x02, 0xf0, 0x80, 0x32, 0x01, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x08, 0x00, 0x00, 0xf0, 0x00, 0x00, 0x08, 0x00, 0x08, 0x03, 0xc0
  ]);
  private ISO_S7COM_NC_HEADER_READ_VAR = Buffer.from([
    0x03,
    0x00,
    0x00,
    0x1d,
    0x02,
    0xf0,
    0x80,
    0x32,
    0x01,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x0c,
    0x00,
    0x00,
    0x04,
    0x01, // ISO / S7 Com Header
    0x12,
    0x08,
    0x82, // NC Header - VarSpec, Length, SyntaxID
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00 // Filled by user parameters
  ]);

  private REQUEST_MAX_PARALLEL = 8;
  private REQUEST_MAX_PDU = 960;

  private ncVariableBuffer: NCItem;
  private dataReadResolveCallback: any;
  private dataReadRejectCallback: any;

  /**
   * Create NCK driver Instance
   */
  public constructor() {}

  /**
   * Adjust the timeout for TCP client and NCK responses
   * @param timeout timeout in ms
   */
  public setConnectionTimeout(timeout: number): void {
    this.timeout = timeout;
    this.tcpClient.setTimeout(this.timeout);
  }

  /**
   * Connect to the NCK of a SIEMENS SINUMERIK 840D
   * @param host the IP of the NCK
   * @param port the port of the TCP connection (for direct ethernet connections to an 840D, this is always 102)
   * @param rack the rack of the NCK module (for direct ethernet connections to an 840D, this is always 0)
   * @param slot the slot of the NCK module (for direct ethernet connections to an 840D, this is always 4)
   */
  public async connect(
    host: string,
    port: number = 102,
    rack: number = 0,
    slot: number = 4
  ): Promise<void> {
    const logPrefix = `${SinumerikNCKProtocolDriver.name}::connect`;

    winston.info(
      `${logPrefix} Try to connect to nc using host: ${host}:${port} (rack: ${rack}, slot: ${slot})`
    );
    try {
      this.tcpClient = new net.Socket();
      this.tcpClient.setTimeout(this.timeout);
      this.tcpClient.once('close', () => {
        winston.warn('NC: Unexpected close event on socket!');
        this.connect(host, port, rack, slot);
      });
      this.connectionState = ConnectionState.NOT_CONNECTED;
      await this.connectTCP(host, port);
      this.connectionState = ConnectionState.TCP_CONNECTED;
      await this.connectISO(rack, slot);
      this.connectionState = ConnectionState.ISO_CONNECTED;
      await this.negotiatePDU();
      this.connectionState = ConnectionState.PDU_NEGOTIATED;
    } catch (error) {
      const errorMessage = `Connection error, could only get to state "${
        ConnectionState[this.connectionState]
      }". (${error})`;
      this.connectionState = ConnectionState.NOT_CONNECTED;
      try {
        await this.disconnect();
      } catch (e) {}
      throw new Error(errorMessage);
    }
  }

  /**
   * Establish a TCP connection to the communication partner
   * @param host ip address of the communication partner
   * @param port tcp port of the communication partner
   */
  private async connectTCP(host: string, port: number): Promise<void> {
    const logPrefix = `${SinumerikNCKProtocolDriver.name}::connectTCP`;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        try {
          if (this.tcpClient) this.tcpClient.removeAllListeners('connect');
        } catch (e) {
          winston.error(
            `${logPrefix} Could not remove listeners from TCP client: ${e}`
          );
        }
        reject(
          new Error(
            'SIEMENS SINUMERIK NCK TCP connection timeout error - check IP address'
          )
        );
        return;
      }, 5000);

      this.tcpClient.on('error', (e) => {
        clearTimeout(timeout);
        reject(e);
        return;
      });
      this.tcpClient.on('connect', () => {
        clearTimeout(timeout);
        winston.debug(`${logPrefix} TCP connected successfully!`);
        resolve();
        return;
      });
      this.tcpClient.connect(port, host);
    });
  }

  /**
   * Connect the ISO (ISO RFC1006 - https://datatracker.ietf.org/doc/html/rfc1006) layer of the S7 communication
   * @param rack rack of the target module (For NCK access always 0)
   * @param slot slot of the target module (For NCK access always 4)
   */
  private async connectISO(rack: number = 0, slot: number = 4): Promise<void> {
    const logPrefix = `${SinumerikNCKProtocolDriver.name}::connectISO`;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        try {
          this.tcpClient.removeAllListeners('data');
        } catch (e) {
          winston.error(
            `${logPrefix} Could not remove listeners from ISO client: ${e}`
          );
        }

        reject(
          new Error(
            'SIEMENS SINUMERIK NCK ISO connection timeout error - check rack and slot number'
          )
        );
        return;
      }, 5000);
      let connectRequest = this.ISO_CONNECT_REQUEST.slice();
      connectRequest[21] = rack * 32 + slot;
      this.tcpClient.on('error', (e) => {
        clearTimeout(timeout);
        reject(e);
        return;
      });

      this.tcpClient.on(
        'data',
        ((data) => {
          clearTimeout(timeout);
          this.tcpClient.removeAllListeners('data');
          if (this.checkConnectISOResponseOk(data)) {
            winston.debug(`${logPrefix} ISO connected successfully!`);
            resolve();
            return;
          } else {
            reject();
            return;
          }
        }).bind(this)
      );
      this.tcpClient.write(connectRequest);
    });
  }

  /**
   * Negotiates the connection parameters, like maximum PDU size and the maximum number of parallel connections with
   * the communication partner
   */
  private async negotiatePDU(): Promise<void> {
    const logPrefix = `${SinumerikNCKProtocolDriver.name}::negotiatePDU`;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.tcpClient.removeAllListeners('data');
        reject(
          new Error(
            'SIEMENS SINUMERIK NCK connection parameter negotiation failed'
          )
        );
      }, 5000);
      let negotiatePDUPacket = this.ISO_NEGOTIATE_PDU.slice();
      negotiatePDUPacket.writeInt16BE(this.REQUEST_MAX_PARALLEL, 19);
      negotiatePDUPacket.writeInt16BE(this.REQUEST_MAX_PARALLEL, 21);
      negotiatePDUPacket.writeInt16BE(this.REQUEST_MAX_PDU, 23);

      negotiatePDUPacket = negotiatePDUPacket.slice(0, 25);

      this.tcpClient.on('error', reject);

      this.tcpClient.on(
        'data',
        ((data) => {
          clearTimeout(timeout);
          this.tcpClient.removeAllListeners('data');

          const parsedData = this.parsePDUResponse(data);

          if (parsedData === 'fastACK') {
            //Read again and wait for the requested data
            throw new Error(
              `Received fast acknowledge, not implemented!, packet: ${data}`
            );
          } else if (
            parsedData[4] + 1 + 12 + parsedData.readInt16BE(13) ===
            parsedData.readInt16BE(2) - 4
          ) {
            // valid the length of the package:
            // ISO_Length + ISO_LengthItself + S7Com_Header + S7Com_Header_ParameterLength === TPKT_Length-4
            const partnerMaxParallel1 = parsedData.readInt16BE(21);
            const partnerMaxParallel2 = parsedData.readInt16BE(23);
            const partnerPDUSize = parsedData.readInt16BE(25);

            let maxParallel = 8;
            let maxPDU;

            if (partnerMaxParallel1 < this.REQUEST_MAX_PARALLEL) {
              maxParallel = partnerMaxParallel1;
            }
            if (partnerMaxParallel2 < this.REQUEST_MAX_PARALLEL) {
              maxParallel = partnerMaxParallel2;
            }
            if (partnerPDUSize < this.REQUEST_MAX_PDU) {
              maxPDU = partnerPDUSize;
            } else {
              maxPDU = this.REQUEST_MAX_PDU;
            }

            winston.debug(
              `${logPrefix} Received PDU Response - max PDU size: ${maxPDU}, max parallel connections: ${maxParallel}`
            );
            this.tcpClient.on(
              'data',
              ((data) => {
                this.parseResponse(data);
              }).bind(this)
            );
          } else {
            winston.error(`${logPrefix} INVALID Telegram received`);
            winston.error(
              `${logPrefix} Byte 0 (header): ${data[0]} - should be 0x03, Byte 5 (header): ${data[5]} - should be 0x0F`
            );
            winston.error(
              `${logPrefix} INVALID PDU RESPONSE or CONNECTION REFUSED - DISCONNECTING`
            );
            winston.error(
              `${logPrefix} TPKT length from header is ${data.readInt16BE(
                2
              )}, buffer length: ${data.length}, COTP length: ${data.readUInt8(
                4
              )}, data[6]: ${data[6]}`
            );
            winston.error(`${logPrefix} Packet: ${data.toString('hex')}`);
            reject();
          }
          resolve();
        }).bind(this)
      );
      this.tcpClient.write(negotiatePDUPacket);
    });
  }

  /**
   * Read the current value of an NCK variable from the NCK using a BTSS string
   * !IMPORTANT: Currently only a subset of BTSS strings is implemented, to read any NCK variable use the "readVariable" method
   * @param btssVariable
   * @returns the current value of the NCK variable
   */
  public async readVariableBTSS(btssVariable: string) {
    const addressParts = btssVariable.split('[');
    const name = addressParts[0];
    return await this.readVariable(NC_ADDRESSES[name]);
  }

  /**
   * Read the current value of an NCK variable from the NCK using the "raw" address information from the NCVarSelector
   * @param ncVar NCK variable address information
   * @returns the current value of the NCK variable
   */
  public async readVariable(ncVar: NCVarSelectorAddress): Promise<any> {
    if (this.connectionState !== ConnectionState.PDU_NEGOTIATED)
      throw new Error('Error, not connected to NCK!');

    const AREA_UNIT_POINTER = 22; // Area/Unit: 3 Bits Area, 5 Bits unit
    const NC_COLUMN_POINTER = 23; // NC Column
    const NC_LINE_POINTER = 25; // NC Line
    const NC_BLOCK_POINTER = 27; // NC Module
    const NC_LINECOUNT_POINTER = 28; // NC Line count

    let requestPacket = this.ISO_S7COM_NC_HEADER_READ_VAR.slice();

    this.ncVariableBuffer = this.createItemReadBuffer(ncVar);

    requestPacket[AREA_UNIT_POINTER] = this.ncVariableBuffer.ncVar.areaUnit; // ((area & 0x07) << 5) | (unit & 0x1f);
    requestPacket.writeUInt16BE(
      this.ncVariableBuffer.ncVar.column,
      NC_COLUMN_POINTER
    ), // [4] =  column / 256; [5] = column & 0xff;
      requestPacket.writeUInt16BE(
        this.ncVariableBuffer.ncVar.line,
        NC_LINE_POINTER
      ), // [6] = line / 256; [7] = line & 0xff;
      (requestPacket[NC_BLOCK_POINTER] = this.ncVariableBuffer.ncVar.blockType);
    requestPacket[NC_LINECOUNT_POINTER] = this.ncVariableBuffer.ncVar.numOfLine;

    this.tcpClient.write(requestPacket);
    return await new Promise(
      ((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(
            new Error(
              `SIEMENS SINUMERIK NCK readVariable timeout. Variable: ${JSON.stringify(
                ncVar
              )}, Request TCP packet: ${requestPacket.toString('hex')}`
            )
          );
        }, 20000);

        this.dataReadResolveCallback = (result) => {
          clearTimeout(timeout);
          resolve(result);
        };
        this.dataReadRejectCallback = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
      }).bind(this)
    );
  }

  /**
   * Creates an NCItem from an NCVarSelectorAddress object
   * @param ncVar NCK variable address information
   * @returns An NC Item containing the address information and buffers for the request results
   */
  private createItemReadBuffer(ncVar: NCVarSelectorAddress): NCItem {
    return {
      byteBuffer: Buffer.alloc(1000),
      value: null,
      ncVar
    };
  }

  /**
   * Validates the response to the connect ISO layer request
   * Returns true if the ISO connection is successfully established
   * @param data the buffer containing the response data
   * @returns the status of the ISO connection
   */
  private checkConnectISOResponseOk(data: Buffer): boolean {
    const logPrefix = `${SinumerikNCKProtocolDriver.name}::checkConnectISOResponseOk`;

    // Expected length is from packet sniffing - some applications may be different.
    if (
      data.readInt16BE(2) !== data.length ||
      data.length < 22 ||
      data[5] !== 0xd0 ||
      data[4] !== data.length - 5
    ) {
      winston.error(`${logPrefix} Invalid response packet for ISO connect:`);
      winston.error(data);
      winston.error(
        `${logPrefix} TPKT Length From Header: ${data.readInt16BE(
          2
        )}, RCV buffer length: ${data.length}, COTP length: ${data.readUInt8(
          4
        )}, data[5]: ${data[5]}`
      );
      return false;
    } else {
      return true;
    }
  }

  /**
   * Decodes the response to the negotiate PDU/connection parameters request
   * @param data the buffer containing the response data
   * @returns
   */
  private parsePDUResponse(data: Buffer) {
    let returnValue = null;
    const RFC_Version = data[0];
    const TPKT_Length = data.readInt16BE(2);
    const TPDU_Code = data[5]; //Data==0xF0 !!
    var LastDataUnit = data[6]; //empty fragmented frame => 0=not the last package; 1=last package

    if (RFC_Version !== 0x03 && TPDU_Code !== 0xf0) {
      //Check if its an RFC package and a Data package
      return 'error';
    } else if (
      LastDataUnit >> 7 === 0 &&
      TPKT_Length == data.length &&
      data.length === 7
    ) {
      // Check if its a Fast Acknowledge package from older PLCs or  WinAC or data is too long ...
      // For example: <Buffer 03 00 00 07 02 f0 00> => data.length==7
      returnValue = 'fastACK';
    } else if (LastDataUnit >> 7 == 1 && TPKT_Length <= data.length) {
      // Check if its an  FastAcknowledge package + S7Data package
      // <Buffer 03 00 00 1b 02 f0 80 32 03 00 00 00 00 00 08 00 00 00 00 f0 00 00 01 00 01 00 f0> => data.length==7+20=27
      returnValue = data;
    } else if (LastDataUnit >> 7 == 0 && TPKT_Length !== data.length) {
      // Check if its an  FastAcknowledge package + FastAcknowledge package+ S7Data package
      // Possibly because NodeS7 or Application is too slow at this moment!
      // <Buffer 03 00 00 07 02 f0 00 03 00 00 1b 02 f0 80 32 03 00 00 00 00 00 08 00 00 00 00 f0 00 00 01 00 01 00 f0>  => data.length==7+7+20=34
      returnValue = data.slice(7, data.length); //Cut off the first Fast Acknowledge Packet
    } else {
      returnValue = 'error';
    }
    return returnValue;
  }

  /**
   * Callback for the TCP client, handels the processing and decoding of the read variable request (NCK)
   * @param data
   */
  private parseResponse(data: Buffer) {
    try {
      this.ncVariableBuffer.byteBuffer = this.processS7ResponsePacket(data);
      this.processS7ReadItem(this.ncVariableBuffer);
      this.dataReadResolveCallback(this.ncVariableBuffer.value);
    } catch (error) {
      this.dataReadRejectCallback(error);
    }
  }

  /**
   * Processes the response packet for a read variable request (NCK), checks the validity of
   * the response codes, status codes and validates payload lengths
   * @param data the buffer containing the response data
   * @returns buffer with only the payload of the read variable item
   */
  private processS7ResponsePacket(data: Buffer): Buffer {
    const PAYLOAD_POINTER = 25;
    const payloadBuffer = data.slice(PAYLOAD_POINTER);

    const protocolId = data[7];
    const messageType = data[8];
    const errorClass = data[17];
    const errorCode = data[18];
    const responseParameterFunctionCode = data[19];
    const responseParameterItemCount = data[20];
    const itemResponseCode = data[21];
    const payloadDataLength = data.length >= 24 ? data.readInt16BE(23) : -1;

    const PROTOCOL_ID_S7_COM = 0x32;
    if (protocolId !== PROTOCOL_ID_S7_COM)
      throw new Error(`Response packet error, bad protocol id: ${protocolId}`);

    const MESSAGE_TYPE_ACK_DATA = 0x3;
    if (messageType !== MESSAGE_TYPE_ACK_DATA) {
      const PLC_RESPONSE_MESSAGE_TYPE = 0x2;
      throw new Error(
        `Response packet error, bad message type: ${messageType} ${
          messageType === PLC_RESPONSE_MESSAGE_TYPE
            ? '- Verify that you are connected to the NCK and not to the PLC'
            : ''
        }`
      );
    }

    if (errorClass !== 0x0 || errorCode !== 0x0)
      throw new Error(
        `Response packet error, s7 com error: Error class: ${errorClass}, error code: ${errorCode}`
      );

    const RESPONSE_PARAMETER_FUNCTION_CODE_READ_VAR = 0x4;
    if (
      responseParameterFunctionCode !==
      RESPONSE_PARAMETER_FUNCTION_CODE_READ_VAR
    )
      throw new Error(
        `Response packet error, bad response parameter function code: ${responseParameterFunctionCode}`
      );

    if (responseParameterItemCount !== 1)
      throw new Error(
        `Response packet problem, more than one item in response (${responseParameterItemCount}). This response decoder can only handle 1 item with the current implementation`
      );

    if (itemResponseCode !== ItemStatusCode.SUCCESS)
      throw new Error(
        `Response item error, item has bad status code ${itemResponseCode} (${ItemStatusCode[itemResponseCode]})`
      );

    if (payloadDataLength !== payloadBuffer.length)
      throw new Error(
        `Response item error, item has bad length. Specified length in item header: ${payloadDataLength}, actual length: ${payloadBuffer.length}`
      );

    return payloadBuffer;
  }

  /**
   * Decodes the read variable response buffer payload to the usable TypeScript value
   * @param ncVariableBuffer The NC object to decode
   */
  private processS7ReadItem(ncVariableBuffer: NCItem) {
    const logPrefix = `${SinumerikNCKProtocolDriver.name}::processS7ReadItem`;

    switch (ncVariableBuffer.ncVar.dataType) {
      case NCVarDataType.DOUBLE:
        ncVariableBuffer.value = ncVariableBuffer.byteBuffer.readDoubleLE(0);
        break;
      case NCVarDataType.DWORD:
        ncVariableBuffer.value = ncVariableBuffer.byteBuffer.readUInt32LE(0);
        break;
      case NCVarDataType.DINT:
        ncVariableBuffer.value = ncVariableBuffer.byteBuffer.readInt32LE(0);
        break;
      case NCVarDataType.WORD:
        ncVariableBuffer.value = ncVariableBuffer.byteBuffer.readUInt16LE(0);
        break;
      case NCVarDataType.STRING:
        ncVariableBuffer.value = '';
        for (
          var charOffset = 0;
          charOffset < ncVariableBuffer.ncVar.byteLength;
          charOffset++
        ) {
          const currentByte = ncVariableBuffer.byteBuffer.readUInt8(charOffset);
          if (currentByte === 0x0) continue;
          ncVariableBuffer.value += String.fromCharCode(currentByte);
        }
        break;
      default:
        winston.warn(
          `${logPrefix} Could not decode response data, unknown data type: ${ncVariableBuffer.ncVar.dataType}`
        );
    }
  }

  /**
   * Disconnect from the NCK (TCP level disconnect)
   */
  public async disconnect(): Promise<void> {
    const logPrefix = `${SinumerikNCKProtocolDriver.name}::disconnect`;

    return new Promise((resolve, reject) => {
      let shutdownTimeoutId;

      if (!this.tcpClient) {
        resolve();
        return;
      }
      this.tcpClient.removeAllListeners('close');
      this.tcpClient.once('close', () => {
        if (this.tcpClient) {
          winston.debug(
            `${logPrefix} NCK Driver: Successfully closed socket on disconnect`
          );
          this.tcpClient.destroy();
          winston.debug(
            `${logPrefix} NCK Driver: Successfully destroyed socket on disconnect`
          );
          delete this.tcpClient;
          clearTimeout(shutdownTimeoutId);
        }
        resolve();
        return;
      });

      this.tcpClient.end();

      winston.debug(`${logPrefix} NCK Driver: Waiting for destroy of socket`);
      this.connectionState = ConnectionState.NOT_CONNECTED;

      shutdownTimeoutId = setTimeout(() => {
        if (this.tcpClient) {
          this.tcpClient.destroy();
          winston.debug(
            `${logPrefix} NCK Driver: Timeout while waiting for socket disconnect.`
          );
          delete this.tcpClient;
        }
        resolve();
        return;
      }, 10000);
    });
  }
}

// Independent NCK test script:
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// (async () => {
//   const nc = new SinumerikNCKProtocolDriver();
//   for (let i = 0; i < 10000; i++) {
//     try {
//       console.log(`--- Round ${i}---`);
//       await nc.connect('192.168.214.1');
//       console.log(
//         await nc.readVariableBTSS('/Channel/ProgramPointer/progName')
//       );
//       await nc.disconnect();
//       // await sleep(1000);
//     } catch (e) {
//       console.log(e);
//       continue;
//     }
//   }
//   console.log('__ END OF TEST__');
//   // @ts-ignore
//   // console.log(process._getActiveHandles());
//   // // @ts-ignore
//   // console.log(process._getActiveRequests());
// })();
