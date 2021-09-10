import { DataSinkProtocols } from "../../common/interfaces";
import { IDataSinkConfig } from "../ConfigManager/interfaces";
import { DataSink } from "./DataSink";
import { MTConnectDataSink } from "./MTConnect";
import { OPCUADataSink } from "./OPCUA";

/**
 * Creates data sink by type
 * @param  {IDataSinkConfig} config
 * @returns DataSink
 */
export const createDataSink = (config: IDataSinkConfig): DataSink => {
  const { protocol, id } = config;

  switch (protocol) {
    case DataSinkProtocols.MTCONNECT:
      return createMTConnectDataSink(config);
    case DataSinkProtocols.OPCUA:
      return createOPCUADataSource(config);
    default:
      throw Error(`Invalid protocol of data sink ${id}`);
  }
};

/**
 * Creates MTConnect data sink
 * @param  {IDataSinkConfig} config
 * @returns MTConnectDataSink
 */
const createMTConnectDataSink = (
  config: IDataSinkConfig
): MTConnectDataSink => {
  const sink = new MTConnectDataSink({ config });
  sink.init();
  return sink;
};

export function createOPCUADataSource(config: IDataSinkConfig): OPCUADataSink {
  return new OPCUADataSink({ config}).init();
}
