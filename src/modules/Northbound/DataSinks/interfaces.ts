import { IBaseLifecycleEvent } from '../../../common/interfaces';

export interface IDataSinkEvent {
  protocol: string;
}

export interface IDataSinkLifecycleEvent extends IBaseLifecycleEvent {
  dataSink: IDataSinkEvent;
  payload?: any;
}
