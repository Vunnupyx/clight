import { DataSinkProtocols } from "../../common/interfaces";
import { IDataSinkConfig } from "../ConfigManager/interfaces";
import { DataSink } from "./DataSink";
import { MTConnectDataSink } from "./MTConnect";

export const createDataSink = (config: IDataSinkConfig): DataSink => {
  const { protocol, id } = config;

  switch (protocol) {
    case DataSinkProtocols.MTCONNECT:
      return createMTConnectDataSource(config);
    default:
      throw Error(`Invalid protocol of data sink ${id}`);
  }
};

const createMTConnectDataSource = (
  config: IDataSinkConfig
): MTConnectDataSink => {
  const sink = new MTConnectDataSink({ config });
  sink.init();
  return sink;
};
