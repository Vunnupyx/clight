import { IMTConnectDataPointTypes } from '../../../ConfigManager/interfaces';

interface ICell {
  '@key': string;
  '#': string;
}

export interface IEntry {
  '@'?: {
    key: string;
    removed?: boolean;
  };
  '@key'?: string;
  '#'?: string;
  Cell?: ICell | ICell[];
}

export interface IEntriesObject {
  [key: string]: string | { [key: string]: string };
}

export interface IMeasurementData {
  '@': {
    dataItemId: string;
    sequence: string;
    subType: string;
    duration: string;
    assetType: string;
    statistic: string;
    timestamp: string;
  };
  '#'?: string;
  Entry?: IEntry | IEntry[];
  name?: string;
}

export interface IMeasurementDataObject {
  [key: string]: IMeasurementData | IMeasurementData[];
}

export interface IComponentStream {
  '@': {
    componentId: string;
    component: string;
    name: string;
  };
  Events:
    | IMeasurementDataObject
    | {
        '#': IMeasurementDataObject[];
      };
  Samples:
    | IMeasurementDataObject
    | {
        '#': IMeasurementDataObject[];
      };
}

export interface IDeviceStream {
  '@': {
    uuid: string;
    name: string;
  };
  ComponentStream: IComponentStream | IComponentStream[];
}

export interface IMTConnectStreamResponse {
  MTConnectStreams: {
    Header: {
      '@': {
        firstSequence: string;
        nextSequence: string;
        lastSequence: string;
        sender: string;
        deviceModelChangeTime: string;
      };
    };
    Streams: {
      DeviceStream: IDeviceStream | IDeviceStream[];
    };
  };
}

export interface IMTConnectStreamError {
  MTConnectError: {
    Errors: {
      Error: {
        '@errorCode': string;
        '#': string;
      };
    };
  };
}

export interface IMTConnectMeasurement {
  id: string;
  name: string;
  sequence: string;
  value: string;
  machineName: string;
  componentName: string;
  type: IMTConnectDataPointTypes;
  timestamp: string;
  assetType?: string;
  subType?: string;
  duration?: string;
  statistic?: string;
  entries?: IEntriesObject;
  status?: string;
}
