import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { from, interval } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';

import { Status, Store, StoreFactory } from '../shared/state';
import { errorHandler, ObjectMap } from '../shared/utils';
import { NetworkConfig } from '../models';
import { HttpMockupService } from 'app/shared';

export class NetworkState {
  status!: Status;
  config!: ObjectMap<NetworkConfig>;
}

// TODO: Connect to Network API
let RESPONSE_CONFIG: ObjectMap<NetworkConfig> = [
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

@Injectable()
export class NetworkService {
  private _store: Store<NetworkState>;

  constructor(
    storeFactory: StoreFactory<NetworkState>,
    private configurationAgentHttpService: HttpMockupService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get config() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.config),
      distinctUntilChanged()
    );
  }

  setNetworkConfigTimer() {
    return interval(10 * 1000).pipe(
      mergeMap(() => from(this.getNetworkConfig()))
    );
  }

  async getNetworkConfig() {
    try {
      const response = await this.configurationAgentHttpService.get<any>(
        `/network/adapters`,
        undefined,
        RESPONSE_CONFIG
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.config = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async updateNetworkConfig(obj: NetworkConfig) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    const verifiedObj = this._serializeNetworkConfig(obj);

    try {
      this.setMockDataById(verifiedObj);
      const response = await this.configurationAgentHttpService.put<any>(
        `/network/adapters/${obj.id}`,
        verifiedObj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.config = RESPONSE_CONFIG;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.UpdateError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  setMockDataById(obj: NetworkConfig) {
    Object.keys(RESPONSE_CONFIG).forEach((key) => {
      if (RESPONSE_CONFIG[key].id.includes(obj.id)) {
        RESPONSE_CONFIG[key] = obj;
      }
    });
  }

  private _emptyState() {
    return <NetworkState>{
      status: Status.NotInitialized
    };
  }

  private _serializeNetworkConfig(config: NetworkConfig): NetworkConfig {
    // The backend should receive empty values for defaultGateway, dnsServer, ipAddr, netmask in case of useDhcp is enabled
    if (['x1', 'x2'].includes(config.id)) {
      if (config.ipv4Settings.dhcp) {
        return {
          ...config,
          ipv4Settings: {
            ...config.ipv4Settings,
            dnsserver: [''],
            defaultGateway: '',
            ipAddresses: [{ Address: '', Netmask: '' }]
          }
        };
      }
    }
    return config;
  }
}
