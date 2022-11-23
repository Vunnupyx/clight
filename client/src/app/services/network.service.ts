import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { from, interval } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';

import { Status, Store, StoreFactory } from '../shared/state';
import { errorHandler } from '../shared/utils';
import {
  NetworkAdapter,
  NetworkConfig,
  NetworkProxy,
  NetworkDateTime,
  NetworkTimestamp,
  NetworkNtpReachable
} from '../models';
import {
  ConfigurationAgentHttpMockupService,
  HttpMockupService
} from 'app/shared';
export interface NetworkState {
  status: Status;
  adapters: NetworkAdapter[];
  proxy: NetworkProxy;
  ntp: string[];
  timestamp: NetworkDateTime;
  ntpReachable: NetworkNtpReachable[];
}

// TODO: Connect to Network API
let RESPONSE_ADAPTERS: NetworkAdapter[] = [
  {
    id: 'x1',
    displayName: 'Ethernet X1 p1',
    enabled: false,
    ipv4Settings: {
      enabled: false,
      dhcp: true,
      ipAddresses: [
        {
          Address: '',
          Netmask: ''
        }
      ],
      defaultGateway: '',
      dnsserver: ['192.168.214.230', '192.168.214.230']
    },
    ipv6Settings: {
      enabled: false,
      dhcp: false,
      ipAddresses: [
        {
          Address: '',
          Netmask: ''
        }
      ],
      defaultGateway: '',
      dnsserver: []
    },
    macAddress: '',
    ssid: ''
  },
  {
    id: 'x2',
    displayName: 'Ethernet X2 p1',
    enabled: false,
    ipv4Settings: {
      enabled: false,
      dhcp: true,
      ipAddresses: [
        {
          Address: '192.168.214.230',
          Netmask: '255.255.255.0'
        }
      ],
      defaultGateway: '192.168',
      dnsserver: ['192.168.214.230', '192.168.214.230']
    },
    ipv6Settings: {
      enabled: false,
      dhcp: false,
      ipAddresses: [
        {
          Address: '',
          Netmask: ''
        }
      ],
      defaultGateway: '',
      dnsserver: []
    },
    macAddress: '',
    ssid: ''
  }
] as any;

// TODO: Connect to Network API
let RESPONSE_PROXY: NetworkProxy = {
  enabled: true,
  host: '',
  port: 62145,
  username: '',
  password: '',
  whitelist: ['']
} as any;

// TODO: Connect to Network API
let RESPONSE_NTP: string[] = ['time.dmgmori.net'] as any;

// TODO: Connect to Network API
let RESPONSE_TIMESTAMP: NetworkTimestamp = {
  Timestamp: 'Sun Jan 09 2022 00:14:58 GMT+0000 (Coordinated Universal Time)'
} as any;

// TODO: Connect to Network API
let RESPONSE_NTP_REACHABLE: NetworkNtpReachable[] = [
  { address: 'time.dmgmori.net', responsible: true, valid: true }
] as any;

@Injectable()
export class NetworkService {
  private _store: Store<NetworkState>;

  constructor(
    storeFactory: StoreFactory<NetworkState>,
    private configurationAgentHttpMockupService: ConfigurationAgentHttpMockupService,
    private httpMockupService: HttpMockupService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get adapters() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.adapters),
      distinctUntilChanged()
    );
  }

  get config() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map(
        (x): NetworkConfig => ({
          x1: x.adapters?.[0],
          x2: x.adapters?.[1],
          proxy: x.proxy,
          ntp:
            x.ntp && x.timestamp
              ? {
                  host: x.ntp,
                  timestamp: x.timestamp,
                  ntpEnabled: !!x.ntp[0]
                }
              : undefined
        })
      ),
      distinctUntilChanged()
    );
  }

  get ntpReachable() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.ntpReachable),
      distinctUntilChanged()
    );
  }

  setNetworkAdaptersTimer() {
    return interval(10 * 1000).pipe(
      mergeMap(() => from(this.getNetworkAdapters()))
    );
  }

  async getNetworkAdapters() {
    try {
      const response = await this.configurationAgentHttpMockupService.get<
        NetworkAdapter[]
      >(`/network/adapters`, undefined, RESPONSE_ADAPTERS);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.adapters = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async updateNetworkAdapter(obj: NetworkAdapter) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    const verifiedObj = this._serializeNetworkAdapters(obj);

    try {
      this.setMockDataById(verifiedObj);
      const response =
        await this.configurationAgentHttpMockupService.put<NetworkAdapter>(
          `/network/adapters/${obj.id}`,
          verifiedObj
        );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.adapters = RESPONSE_ADAPTERS;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.UpdateError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async getNetworkProxy() {
    try {
      const response =
        await this.configurationAgentHttpMockupService.get<NetworkProxy>(
          `/network/proxy`,
          undefined,
          RESPONSE_PROXY
        );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.proxy = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async updateNetworkProxy(obj: NetworkProxy) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      await this.configurationAgentHttpMockupService.put<NetworkProxy>(
        `/network/proxy`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.proxy = obj;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.UpdateError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async getNetworkNtp() {
    try {
      const response = await this.configurationAgentHttpMockupService.get<
        string[]
      >(`/network/ntp`, undefined, RESPONSE_NTP);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.ntp = response;
      });
      !!response?.[0] && this.getNtpReachable(response);
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async updateNetworkNtp(obj: string[]) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
      state.ntpReachable = [{ address: '', responsible: false, valid: false }];
    });

    try {
      await this.configurationAgentHttpMockupService.put<string[]>(
        `/network/ntp`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.ntp = obj;
      });
      !!obj?.[0] && this.getNtpReachable(obj);
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.UpdateError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async getNtpReachable(ntp: string[]) {
    try {
      const response = await this.httpMockupService.get<NetworkNtpReachable[]>(
        `/check-ntp?`,
        { params: { address: ntp[0] }, responseType: 'json' },
        RESPONSE_NTP_REACHABLE
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.ntpReachable = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async getNetworkTimestamp() {
    try {
      const response =
        await this.configurationAgentHttpMockupService.get<NetworkTimestamp>(
          `/system/time`,
          undefined,
          RESPONSE_TIMESTAMP
        );

      const verifiedObj = this._serializeNetworkTimestamp(response);

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.timestamp = verifiedObj;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async updateNetworkTimestamp(obj: NetworkDateTime) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    const verifiedObj = this._deserializeNetworkTimestamp(obj);

    try {
      await this.configurationAgentHttpMockupService.put<NetworkTimestamp>(
        `/system/time`,
        verifiedObj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.timestamp = obj;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.UpdateError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  setMockDataById(obj: NetworkAdapter) {
    Object.keys(RESPONSE_ADAPTERS).forEach((key) => {
      if (RESPONSE_ADAPTERS[key].id.includes(obj.id)) {
        RESPONSE_ADAPTERS[key] = obj;
      }
    });
  }

  private _emptyState() {
    return <NetworkState>{
      status: Status.NotInitialized,
      ntpReachable: [{ address: '', responsible: false, valid: false }]
    };
  }

  private _serializeNetworkAdapters(adapter: NetworkAdapter): NetworkAdapter {
    // The backend should receive empty values for defaultGateway, dnsServer, ipAddr, netmask in case of useDhcp is enabled
    if (['x1', 'x2'].includes(adapter.id)) {
      if (adapter.ipv4Settings.dhcp) {
        return {
          ...adapter,
          ipv4Settings: {
            ...adapter.ipv4Settings,
            dnsserver: [''],
            defaultGateway: '',
            ipAddresses: [{ Address: '', Netmask: '' }]
          }
        };
      }
    }
    return adapter;
  }

  private _serializeNetworkTimestamp(
    timestamp: NetworkTimestamp
  ): NetworkDateTime {
    return {
      datetime: moment(timestamp?.Timestamp)
        .parseZone()
        .format('YYYY-MM-DDTHH:mm:ss'),
      timezone: 'Universal'
    };
  }

  private _deserializeNetworkTimestamp(
    timestamp: NetworkDateTime
  ): NetworkTimestamp {
    return {
      Timestamp: moment
        .tz(timestamp.datetime, timestamp.timezone)
        .toISOString(true)
    };
  }
}
