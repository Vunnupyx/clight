import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { NetworkService } from '../../../services/network.service';
import { Status } from '../../../shared/state';
import { clone, ObjectMap } from '../../../shared/utils';
import { NetworkConfig, NetworkType } from '../../../models';
import { HOST_REGEX, PORT_REGEX } from '../../../shared/utils/regex';
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit, OnDestroy {
  NetworkType = NetworkType;

  config!: ObjectMap<NetworkConfig>;
  originalConfig!: ObjectMap<NetworkConfig>;

  hostRegex = HOST_REGEX;
  portRegex = PORT_REGEX;

  get tabs() {
    if (!this.config) {
      return [];
    }

    return Object.keys(this.config);
  }

  sub: Subscription = new Subscription();
  selectedTab!: string;

  constructor(private networkService: NetworkService) { }

  ngOnInit(): void {
    this.sub.add(
      this.networkService.config.pipe(filter(el => !!el)).subscribe(x => this.onConfig(x))
    );

    this.networkService.getNetworkConfig();
  }

  private onConfig(x: ObjectMap<NetworkConfig>) {
    this.config = x;
    this.originalConfig = clone(x);

    if (!this.selectedTab) {
      this.selectedTab = this.tabs[0];
    }
  }

  onSelectTab(tab: string) {
    this.selectedTab = tab;

    this.config = clone(this.originalConfig);
  }

  saveChanges() {
    this.networkService.updateNetworkConfig(this.config)
      .then(() => this.originalConfig = clone(this.config));
  }

  saveDhcpChanges(ethernetType: NetworkType) {
    const useDhcp = this.config[ethernetType].useDhcp;

    if (useDhcp) {
      const newConfig = {
        ...this.config,
        [ethernetType]: {
          useDhcp,
        }
      }

      return this.networkService.updateNetworkConfig(newConfig as ObjectMap<NetworkConfig>)
        .then(() => this.originalConfig = clone(this.config));
    }

    return this.saveChanges();
  }

  saveUseProxyChanges() {
    const useProxy = this.config[NetworkType.PROXY].useProxy;

    if (!useProxy) {
      const newConfig = {
        ...this.config,
        [NetworkType.PROXY]: {
          useProxy,
        },
      }

      return this.networkService.updateNetworkConfig(newConfig as ObjectMap<NetworkConfig>)
        .then(() => this.originalConfig = clone(this.config));
    }

    return this.saveChanges();
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
