import winston from 'winston';
import { DataSinkProtocols } from '../../common/interfaces';
import { IDataHubDataSinkConfig, IDataSinkConfig } from '../ConfigManager/interfaces';
import { DatahubDataSink } from './Datahub';
import { DataSink } from './DataSink';
import { MTConnectDataSink } from './MTConnect';
import { OPCUADataSink } from './OPCUA';

/**
 * Creates data sink by type
 * @param  {IDataSinkConfig} config
 * @returns DataSink
 */
export const createDataSink = (config: IDataSinkConfig): DataSink | null => {
  const { protocol } = config;

  switch (protocol) {
    case DataSinkProtocols.MTCONNECT:
      return createMTConnectDataSink(config);
    case DataSinkProtocols.OPCUA:
      return createOPCUADataSink(config);
    case DataSinkProtocols.DATAHUB:
      return createDataHubDataSink(config);
    default:
      throw Error(`Invalid protocol of data sink ${protocol}`);
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

function createOPCUADataSink(config: IDataSinkConfig): OPCUADataSink {
  return new OPCUADataSink({ config }).init();
}

function createDataHubDataSink(config: IDataHubDataSinkConfig): DatahubDataSink {
  // TODO: Implement
  const sink  = new DatahubDataSink({config});
  try {
    sink.init();
  } catch (err) {
    winston.error(`createDataHubDataSink error due init failed.`);
    return null;
  }
  return sink;
}
