import { DataSource } from "./DataSource";
import { IDataSourceConfig } from "../ConfigManager/interfaces";
import { DataSourceProtocols } from "../../common/interfaces";
import { S7DataSource } from "./S7";
import { IoshieldDataSource } from "./Ioshield";

/**
 * Create data source for different types
 * @param  {IDataSourceConfig} config
 * @returns DataSource
 */
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

/**
 * Creates s7 data source
 * @param  {IDataSourceConfig} config
 * @returns S7DataSource
 */
const createS7DataSource = (config: IDataSourceConfig): S7DataSource => {
  return new S7DataSource({ config });
};

/**
 * Creates io shield data source
 * @param  {IDataSourceConfig} config
 * @returns IoshieldDataSource
 */
const createIoshieldDataSource = (
  config: IDataSourceConfig
): IoshieldDataSource => {
  return new IoshieldDataSource({ config });
};
