import winston from 'winston';
import { DataSource } from '../DataSource';
import { LifecycleEventStatus } from '../../../../common/interfaces';
import { IDataSourceParams } from '../interfaces';
import {
  IComponentStream,
  IEntriesObject,
  IEntry,
  IHostConnectivityState,
  IMTConnectMeasurement,
  IMTConnectStreamError,
  IMTConnectStreamResponse,
  IMeasurementDataObject,
  IMeasurementData
} from './interfaces';
import {
  IDataPointConfig,
  IMTConnectDataSourceConnection
} from '../../../ConfigManager/interfaces';
import fetch from 'node-fetch';
import { convert } from 'xmlbuilder2';
import { isValidIpOrHostname } from '../../../Utilities';

/**
 * Implementation of MTConnect data source
 */
export class MTConnectDataSource extends DataSource {
  protected name = MTConnectDataSource.name;
  private dataPoints: IDataPointConfig[];
  private nextSequenceNumber: number | null = null;
  private lastSequenceNumber: number | null = null;
  private requestCount = 1;
  private hostname = '';
  private DATAPOINT_READ_INTERVAL = 1000;

  constructor(params: IDataSourceParams) {
    super(params);

    this.dataPoints = params.config.dataPoints;
    let { hostname: host, port } = this.config
      .connection as IMTConnectDataSourceConnection;
    let machineName = this.config.machineName;
    this.hostname = isValidIpOrHostname(host)
      ? host?.startsWith('http')
        ? machineName
          ? `${host}:${port}/${machineName}`
          : `${host}:${port}`
        : machineName
        ? `http://${host}:${port}/${machineName}`
        : `http://${host}:${port}`
      : '';
  }

  /**
   * Initializes MTConnect data source
   */
  public async init(): Promise<void> {
    const logPrefix = `${this.name}::init`;
    winston.info(`${logPrefix} initializing.`);

    const { enabled } = this.config;

    if (!enabled) {
      winston.info(
        `${logPrefix} MTConnect data source is disabled. Skipping initialization.`
      );
      this.updateCurrentStatus(LifecycleEventStatus.Disabled);
      return;
    }

    if (!this.termsAndConditionsAccepted) {
      winston.warn(
        `${logPrefix} skipped start of MTConnect data source due to not accepted terms and conditions`
      );
      this.updateCurrentStatus(
        LifecycleEventStatus.TermsAndConditionsNotAccepted
      );
      return;
    }
    this.updateCurrentStatus(LifecycleEventStatus.Connecting);

    try {
      await this.testHostConnectivity();

      if (this.currentStatus === LifecycleEventStatus.Connected) {
        if (this.reconnectTimeoutId) {
          clearTimeout(this.reconnectTimeoutId);
          this.reconnectTimeoutId = null;
        }
        winston.info(
          `${logPrefix} successfully connected to MT Connect Source`
        );
        if (this.config.type === 'Agent') {
          // Currently only Agent is supported.
          await this.getAndProcessCurrentResponse();

          this.setupDataPoints(this.DATAPOINT_READ_INTERVAL);
          this.setupLogCycle();
        }
      } else {
        throw new Error(`Host status:${this.currentStatus}`);
      }
    } catch (error) {
      winston.error(`${logPrefix} ${(error as Error)?.message}`);

      this.updateCurrentStatus(LifecycleEventStatus.ConnectionError);
      this.reconnectTimeoutId = setTimeout(() => {
        try {
          this.updateCurrentStatus(LifecycleEventStatus.Reconnecting);
          this.init();
        } catch (error) {
          winston.error(`${logPrefix} error in reconnecting: ${error}`);
        }
      }, this.RECONNECT_TIMEOUT);
      return;
    }
  }

  /**
   * Reads all datapoints for current cycle and creates resulting events
   */
  protected async dataSourceCycle(
    currentIntervals: Array<number>
  ): Promise<void> {
    this.readCycleCount = this.readCycleCount + 1;

    try {
      await this.getAndProcessSampleResponse();
    } catch (e) {
      winston.error(e);
    }
  }

  /**
   * Disconnects data source
   */
  public async disconnect(): Promise<void> {
    const logPrefix = `${this.name}::disconnect`;
    winston.debug(`${logPrefix} triggered.`);

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    this.updateCurrentStatus(LifecycleEventStatus.Disconnected);
  }

  /**
   * Gets the response for /current endpoint and processes the stream result.
   * This endpoint gives current status of all data points and the sequence numbers
   */
  private async getAndProcessCurrentResponse() {
    const logPrefix = `${MTConnectDataSource.name}::getCurrentResponse`;
    const response = await this.getMTConnectAgentXMLResponseAsObject(
      '/current'
    );
    this.handleStreamResponse(response as IMTConnectStreamResponse);
  }

  /**
   * Gets the response for /sample endpoint and processes the stream result
   * This endpoint returns the requested count amount of changes in data point values as well as sequence numbers
   */
  private async getAndProcessSampleResponse() {
    const logPrefix = `${MTConnectDataSource.name}::getSampleResponse`;
    const response = await this.getMTConnectAgentXMLResponseAsObject(
      '/sample',
      this.nextSequenceNumber ?? 0
    );

    if ((response as IMTConnectStreamError).MTConnectError) {
      const errorCode = (response as IMTConnectStreamError).MTConnectError
        ?.Errors?.Error?.['@errorCode'];
      const errorMessage: string = (response as IMTConnectStreamError)
        .MTConnectError?.Errors?.Error?.['#'];

      if (
        errorMessage.includes('must be greater than') ||
        errorMessage.includes('must be less than')
      ) {
        // Runtime is behind, should sync to next possible firstSequence and must quickly read to catch up to actual nextSequenceNumber
        // OR
        // Runtime is too fast, should sync back to last value
        // This should not happen as varying request count always stays in sync

        // new first sequence number is the number that is written in the error message as the minimum number. Regex extracts the number
        const newSequenceNumber = errorMessage.match(/\d+/g)?.[0] ?? '0';
        this.nextSequenceNumber = parseInt(newSequenceNumber);

        winston.warn(
          `${logPrefix} current sequence number ${this.nextSequenceNumber} is ${
            errorMessage.includes('must be greater than') ? 'less' : 'more'
          } than minimum allowed. Updating next sequence number to:${newSequenceNumber}`
        );
      } else {
        winston.warn(`${logPrefix} ${errorMessage}`);
      }
    } else {
      this.handleStreamResponse(response as IMTConnectStreamResponse);
    }
  }

  /**
   * Handles sequence number from the stream response. Sequence number is used to stay in sync with measurements Agent publishes.
   */
  private handleSequenceNumbers(
    streamResponse: IMTConnectStreamResponse
  ): void {
    const {
      firstSequence,
      nextSequence,
      lastSequence,
      sender,
      deviceModelChangeTime
    } = streamResponse?.MTConnectStreams?.Header?.['@'] ?? {};
    this.nextSequenceNumber = parseInt(nextSequence);
    this.lastSequenceNumber = parseInt(lastSequence);
    if (this.lastSequenceNumber - this.nextSequenceNumber > 1) {
      // If runtime is behind the last sequence more than 1, then make the next request count to be the difference to catch up
      const diff = this.lastSequenceNumber - this.nextSequenceNumber;
      this.requestCount = Math.min(diff, 1000); // Request count should be max 1000
    } else {
      // otherwise read single count
      this.requestCount = 1;
    }
  }

  /**
   * Handles stream response for both /current and /sample endpoints
   */
  private handleStreamResponse(streamResponse: IMTConnectStreamResponse): void {
    this.handleSequenceNumbers(streamResponse);

    let devicesStream = streamResponse?.MTConnectStreams?.Streams?.DeviceStream;
    if (!devicesStream) {
      return;
    }
    if (!Array.isArray(devicesStream)) {
      devicesStream = [devicesStream];
    }

    for (const deviceStreamItem of devicesStream) {
      const { uuid, name: machineName } = deviceStreamItem['@'] ?? {};
      let componentsStream = Array.isArray(deviceStreamItem.ComponentStream)
        ? deviceStreamItem.ComponentStream
        : [deviceStreamItem.ComponentStream];

      for (const componentStreamItem of componentsStream) {
        const {
          componentId,
          component,
          name: componentName
        } = componentStreamItem['@'] ?? {};

        // ## Check Events
        this.processEventsOrSamples(
          'Event',
          componentStreamItem,
          machineName,
          componentName
        );

        // ## Check Samples
        this.processEventsOrSamples(
          'Sample',
          componentStreamItem,
          machineName,
          componentName
        );
        // ## Check Conditions
        // Out of Scope
      }
    }
  }

  /**
   * Processes the stream item object to make it ready for extracting measurements.
   */
  private processComponentStreamItemObj(
    arrayToProcess: IMeasurementData[],
    name: string,
    list: IMeasurementData | IMeasurementData[]
  ) {
    let eventOrSampleArray = Array.isArray(list) ? list : [list];

    eventOrSampleArray
      .sort(
        // sort potentially multiple measurements by sequence in ascending order!
        (a, b) => parseInt(a['@']?.sequence) - parseInt(b['@']?.sequence)
      )
      .forEach((details) => {
        arrayToProcess.push({ ...details, name });
      });
  }

  /**
   * Processes EVENT or SAMPLE type stream
   */
  private processEventsOrSamples(
    type: 'Event' | 'Sample',
    componentStreamItem: IComponentStream,
    machineName: string,
    componentName: string
  ) {
    const logPrefix = `${MTConnectDataSource.name}::processEventOrSample`;
    let keyToUse: 'Events' | 'Samples';
    switch (type) {
      case 'Event':
        keyToUse = 'Events';
        break;
      case 'Sample':
        keyToUse = 'Samples';
        break;
      default:
        return;
    }
    let arrayToProcess: IMeasurementData[] = [];

    // In case of recurring event/sample names, events/samples are grouped under # key as an array, otherwise as an object.
    if (
      componentStreamItem[keyToUse]?.['#'] &&
      Array.isArray(componentStreamItem[keyToUse]?.['#'])
    ) {
      (
        componentStreamItem[keyToUse]?.['#'] as IMeasurementDataObject[]
      ).forEach((obj) => {
        Object.entries(obj).forEach(([name, list]) =>
          this.processComponentStreamItemObj(arrayToProcess, name, list)
        );
      });
    } else {
      Object.entries(
        (componentStreamItem[keyToUse] ?? {}) as IMeasurementDataObject
      ).forEach(([name, list]) =>
        this.processComponentStreamItemObj(arrayToProcess, name, list)
      );
    }

    for (let detailObject of arrayToProcess) {
      const {
        dataItemId,
        duration,
        sequence,
        subType,
        assetType,
        statistic,
        timestamp
      } = detailObject['@'] ?? {};
      const value = detailObject['#'] ?? '';
      // In some cases Entry can be present instead of a value
      let entries: IEntry[] = [];
      let entriesObject: IEntriesObject = {};

      if (detailObject.Entry) {
        entries = Array.isArray(detailObject.Entry)
          ? detailObject.Entry
          : [detailObject.Entry];

        entries.forEach((entry) => {
          const keyName = entry['@key'] ?? entry['@']?.key ?? '';
          const keyValue = entry['#'] ?? '';

          if (entry.Cell) {
            if (!entriesObject[keyName]) {
              entriesObject[keyName] = {};
            }
            let cells = Array.isArray(entry.Cell) ? entry.Cell : [entry.Cell];
            cells?.forEach((cellInfo) => {
              const cellKeyName = cellInfo['@key'];
              const cellValue = cellInfo['#'];
              (entriesObject[keyName] as { [key: string]: string })[
                cellKeyName
              ] = cellValue;
            });
          } else {
            entriesObject[keyName] = keyValue;
          }
        });
      }

      let measurement: IMTConnectMeasurement = {
        id: dataItemId,
        duration,
        statistic,
        name: detailObject.name ?? '',
        sequence,
        assetType,
        subType,
        value,
        machineName,
        componentName,
        type:
          type === 'Event'
            ? 'event'
            : type === 'Sample'
            ? 'sample'
            : 'condition',
        timestamp
      };

      if (entries?.length > 0) {
        measurement.entries = entriesObject;
      }

      const matchingDatapoint = this.dataPoints.find(
        (dp) => dp.address === dataItemId
      );
      // Send the reading as measurement if it is a requested data point
      if (matchingDatapoint) {
        // Measurement sent directly to be able to handle multiple events for same data point
        this.onDataPointMeasurement([
          { ...measurement, id: matchingDatapoint.id }
        ]);
      }
    }
  }

  /**
   * Makes the API call according to given parameters and returns parsed XML as an object
   */
  private getMTConnectAgentXMLResponseAsObject(
    endpoint: '/probe' | '/current' | '/sample',
    nextSequence?: number
  ): Promise<IMTConnectStreamResponse | IMTConnectStreamError> {
    const logPrefix = `${this.name}::getMTConnectAgentResponse`;

    return new Promise(async (resolve, reject) => {
      if (!['/probe', '/current', '/sample'].includes(endpoint)) {
        const err = `${logPrefix} unexpected endpoint request for MTConnect Agent: ${endpoint}`;
        winston.error(err);
        return reject(new Error(err));
      }
      if (endpoint === '/sample' && typeof nextSequence !== 'number') {
        const err = `${logPrefix} missing next sequence number`;
        winston.error(err);
        return reject(new Error(err));
      }
      if (!this.hostname) {
        const err = `${logPrefix} missing hostname`;
        winston.error(err);
        return reject(new Error(err));
      }
      try {
        const fetchUrl =
          endpoint === '/sample'
            ? `${this.hostname}${endpoint}?from=${nextSequence}&count=${this.requestCount}`
            : `${this.hostname}${endpoint}`;
        const response = await fetch(fetchUrl, {
          method: 'GET',
          timeout: 5000,
          compress: false,
          headers: {
            Accept: 'text/xml'
          }
        });
        const xmlString = await response?.text();
        const xmlObj = convert(xmlString, {
          format: 'object',
          group: true
        });
        this.updateCurrentStatus(LifecycleEventStatus.Connected);
        if (this.reconnectTimeoutId) {
          clearTimeout(this.reconnectTimeoutId);
          this.reconnectTimeoutId = null;
        }

        // TODO type cast xmlObj from XMLSerializedAsObject
        //@ts-ignore
        return resolve(xmlObj);
      } catch (e) {
        this.updateCurrentStatus(LifecycleEventStatus.ConnectionError);
        const err = `${logPrefix} unexpected error occurred while fetching XML response: ${
          e as Error
        }`;
        winston.error(err);
        return reject(new Error(err));
      }
    });
  }

  /**
   * Tests connectivity to given hostname
   */
  public async testHostConnectivity() {
    const logPrefix = `${MTConnectDataSource.name}::testHostConnectivity`;

    try {
      const response = await fetch(this.hostname, {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        this.updateCurrentStatus(LifecycleEventStatus.Connected);
        if (this.reconnectTimeoutId) {
          clearTimeout(this.reconnectTimeoutId);
          this.reconnectTimeoutId = null;
        }
      } else {
        throw new Error('Response not OK');
      }
    } catch (err) {
      winston.warn(
        `${logPrefix} error connecting to MTConnect Agent at ${this.hostname}, err: ${err}`
      );
      this.updateCurrentStatus(LifecycleEventStatus.ConnectionError);
    }
  }
}
