import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { from, interval } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';

import { Status, Store, StoreFactory } from '../shared/state';
import { errorHandler } from '../shared/utils';
import { NetworkAdapter, NetworkProxy } from '../models';
import { HttpMockupService } from 'app/shared';
export interface NetworkState {
  status: Status;
  adapters: NetworkAdapter[];
  proxy: NetworkProxy;
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

  get adapters() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.adapters),
      distinctUntilChanged()
    );
  }

  get proxy() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.proxy),
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
      const response = await this.configurationAgentHttpService.get<any>(
        `/network/adapters`,
        undefined,
        RESPONSE_ADAPTERS
      );
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
      const response = await this.configurationAgentHttpService.put<any>(
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
      const response = await this.configurationAgentHttpService.get<any>(
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
      await this.configurationAgentHttpService.put<any>(`/network/proxy`, obj);
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

  setMockDataById(obj: NetworkAdapter) {
    Object.keys(RESPONSE_ADAPTERS).forEach((key) => {
      if (RESPONSE_ADAPTERS[key].id.includes(obj.id)) {
        RESPONSE_ADAPTERS[key] = obj;
      }
    });
  }

  private _emptyState() {
    return <NetworkState>{
      status: Status.NotInitialized
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
}
