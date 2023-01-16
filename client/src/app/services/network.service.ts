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
  NetworkDateTime,
  NetworkProxy,
  NetworkTimestamp,
  NetworkNtpReachable
} from '../models';
import { ConfigurationAgentHttpService, HttpService } from 'app/shared';
export interface NetworkState {
  status: Status;
  adapters: NetworkAdapter[];
  proxy: NetworkProxy;
  ntp: string[];
  timestamp: NetworkDateTime;
  ntpReachable: NetworkNtpReachable[];
}

@Injectable()
export class NetworkService {
  private _store: Store<NetworkState>;

  constructor(
    storeFactory: StoreFactory<NetworkState>,
    private configurationAgentHttpService: ConfigurationAgentHttpService,
    private httpService: HttpService,
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
      map((x) => x.ntpReachable)
    );
  }

  setNetworkAdaptersTimer() {
    return interval(10 * 1000).pipe(
      mergeMap(() => from(this.getNetworkAdapters()))
    );
  }

  async getNetworkAdapters() {
    try {
      const response = await this.configurationAgentHttpService.get<
        NetworkAdapter[]
      >(`/network/adapters`);

      const verifiedAdapters = this._deserializeNetworkAdapters(response);

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.adapters = verifiedAdapters;
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
      const response =
        await this.configurationAgentHttpService.put<NetworkAdapter>(
          `/network/adapters/${obj.id}`,
          verifiedObj
        );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        Object.keys(state.adapters).forEach((key) => {
          if (state.adapters[key].id.includes(obj.id)) {
            state.adapters[key] = response;
          }
        });
      });
      this.toastr.success(
        this.translate.instant('settings-network.UpdateAdapterSuccess')
      );
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
        await this.configurationAgentHttpService.get<NetworkProxy>(
          `/network/proxy`
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
      await this.configurationAgentHttpService.put<NetworkProxy>(
        `/network/proxy`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.proxy = obj;
      });
      this.toastr.success(
        this.translate.instant('settings-network.UpdateProxySuccess')
      );
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
      const response = await this.configurationAgentHttpService.get<string[]>(
        `/network/ntp`
      );
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
      state.ntpReachable = [{ address: '', reachable: false, valid: false }];
    });

    try {
      await this.configurationAgentHttpService.put<string[]>(
        `/network/ntp`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.ntp = obj;
      });
      this.toastr.success(
        this.translate.instant('settings-network.UpdateNtpSuccess')
      );
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
      const response = await this.httpService.get<NetworkNtpReachable[]>(
        `/check-ntp?`,
        { params: { addresses: ntp }, responseType: 'json' }
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
        await this.configurationAgentHttpService.get<NetworkTimestamp>(
          `/system/time`
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
      await this.configurationAgentHttpService.put<NetworkTimestamp>(
        `/system/time`,
        verifiedObj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.timestamp = obj;
      });
      this.toastr.success(
        this.translate.instant('settings-network.UpdateTimestampSuccess')
      );
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.UpdateError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  private _emptyState() {
    return <NetworkState>{
      status: Status.NotInitialized,
      ntpReachable: [{ address: '', reachable: false, valid: false }]
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
    const maskNodes: string[] =
      adapter.ipv4Settings.ipAddresses[0].Netmask.match(/(\d+)/g);
    let cidr = 0;
    for (let i in maskNodes) {
      cidr += ((+maskNodes[i] >>> 0).toString(2).match(/1/g) || []).length;
    }
    return {
      ...adapter,
      ipv4Settings: {
        ...adapter.ipv4Settings,
        ipAddresses: [
          {
            Address: adapter.ipv4Settings.ipAddresses[0].Address,
            Netmask: String(cidr)
          }
        ]
      }
    };
  }

  private _deserializeNetmask(netmask: unknown): number[] {
    const mask = 0xffffffff << (32 - Number(netmask));
    return [mask >>> 24, (mask >> 16) & 0xff, (mask >> 8) & 0xff, mask & 0xff];
  }

  private _deserializeNetworkAdapters(
    adapters: NetworkAdapter[]
  ): NetworkAdapter[] {
    return adapters.map((adapter) => {
      const address = adapter?.ipv4Settings?.ipAddresses[0];
      return {
        ...adapter,
        ipv4Settings: {
          ...adapter.ipv4Settings,
          ipAddresses: [
            {
              Address: address?.Address,
              Netmask:
                address?.Netmask &&
                this._deserializeNetmask(address.Netmask).join('.')
            }
          ]
        }
      };
    });
  }

  private _serializeNetworkTimestamp(
    timestamp: NetworkTimestamp
  ): NetworkDateTime {
    return {
      datetime: moment(timestamp?.Timestamp).format('YYYY-MM-DDTHH:mm:ss')
    };
  }

  private _deserializeNetworkTimestamp(
    timestamp: NetworkDateTime
  ): NetworkTimestamp {
    return {
      Timestamp: moment
        .utc(timestamp.datetime)
        .add(moment(timestamp.datetime).utcOffset(), 'm')
        .toISOString()
    };
  }
}
