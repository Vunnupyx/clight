import { IDataSourceConfig } from '../../ConfigManager/interfaces';
import {
  EventLevels,
  IBaseLifecycleEvent,
  LifecycleEventStatus
} from '../../../common/interfaces';

export interface IMeasurement {
  id: string; // unique id of the source data point
  name: string;
  value: string | number | boolean;
  unit?: string;
  description?: string;
}

export interface IDataSourceParams {
  readonly config: IDataSourceConfig;
  readonly termsAndConditionsAccepted: boolean;
}

export interface IDataSourceEvent {
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
  Measurement = 'datasource-measurement',
  Error = 'datasource-error',
  Lifecycle = 'datasource-lifecycle'
}

export enum DataSinkEventTypes {
  Lifecycle = 'datasource-lifecycle'
}

export enum DataPointEventTypes {
  Measurement = 'datapoint-measurement',
  Error = 'datapoint-error',
  Lifecycle = 'datapoint-lifecycle'
}
