import { DataSource } from "./DataSource";
import { IDataSourceConfig } from "../ConfigManager/interfaces";
import { DataSourceProtocols } from "../../common/interfaces";
import { S7DataSource } from "./S7";

export const createDataSource = (
  config: IDataSourceConfig
): DataSource | void => {
  const { protocol } = config;

  if (protocol === DataSourceProtocols.S7) {
    return createS7DataSource(config);
  }
};

const createS7DataSource = (config: IDataSourceConfig): S7DataSource => {
  return new S7DataSource({ config });
};
