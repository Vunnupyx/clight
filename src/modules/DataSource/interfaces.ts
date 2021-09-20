import { IDataSourceConfig } from "../ConfigManager/interfaces";
import {
  IBaseLifecycleEvent,
  LifecycleEventStatus,
} from "../../common/interfaces";
export interface IDataSourceLifecycleEvent extends IBaseLifecycleEvent {
  dataSource: IDataSourceEvent;
  status: LifecycleEventStatus;
  payload?: any;
}

export interface IMeasurement {
  id: string;
  name: string;
  value: string | number | boolean;
}

export interface IDataSourceParams {
  readonly config: IDataSourceConfig;
}

export interface IDataSourceEvent {
  name: string;
  protocol: string;
}

export interface IDataSourceMeasurementEvent {
  measurement: IMeasurement;
  dataSource: IDataSourceEvent;
}

export interface IDataSourceLifecycleEvent extends IBaseLifecycleEvent {
  dataSource: IDataSourceEvent;
  status: LifecycleEventStatus;
  payload?: any;
}

export interface IDataSourceDataPointLifecycleEvent
  extends IBaseLifecycleEvent {
  dataSource: IDataSourceEvent;
  payload?: any;
}

export enum DataSourceEventTypes {
  Measurement = "datasource-measurement",
  Error = "datasource-error",
  Lifecycle = "datasource-lifecycle",
}

export enum DataPointEventTypes {
  Measurement = "datapoint-measurement",
  Error = "datapoint-error",
  Lifecycle = "datapoint-lifecycle",
}
