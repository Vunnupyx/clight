export enum ServiceStatus {
  Running = 'running',
  Stopped = 'stopped',
  Unknown = 'unknown'
}

export enum UpdateStatus {
  NoUpdate = 'noupdate',
  ClientUpdating = 'clientupdating',
  SiteControlUpdating = 'sitecontrolupdating'
}

export interface NetServiceStatus {
  ServiceStatus: ServiceStatus;
  Connected: boolean;
  ConnectedClients: string[];
  UpdateStatus: UpdateStatus;
  FacilityTree: string;
  StatusIcon: string;
}

export interface CentralServer {
  url: string;
  port: number;
}
