import { DataSource } from "./DataSource";
import { IDataSourceConfig } from "../ConfigManager/interfaces";
import { DataSourceProtocols } from "../../common/interfaces";
import { S7DataSource } from "./S7";
import { IoshieldDataSource } from "./Ioshield";

export const createDataSource = (
  config: IDataSourceConfig
): DataSource | void => {
  const { protocol } = config;

  if (protocol === DataSourceProtocols.S7) {
    return createS7DataSource(config);
  }

  if (protocol === DataSourceProtocols.IOSHIELD) {
    return createIoshieldDataSource(config);
  }
};

const createS7DataSource = (config: IDataSourceConfig): S7DataSource => {
  return new S7DataSource({ config });
};

const createIoshieldDataSource = (
  config: IDataSourceConfig
): IoshieldDataSource => {
  return new IoshieldDataSource({ config });
};
