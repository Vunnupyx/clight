import { Component, OnInit } from '@angular/core';
import { CommissioningService } from 'app/services';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  AdapterConnection,
  ConfigurationStatus,
  DataHubModule,
  DataHubModuleName,
  DataHubModuleStatus,
  LinkStatus,
  MachineInformation,
  NetworkAdapter
} from 'app/models';
import { ObjectMap } from 'app/shared/utils';

@Component({
  selector: 'app-commissioning',
  templateUrl: './commissioning.component.html',
  styleUrls: ['./commissioning.component.scss']
})
export class CommissioningComponent implements OnInit {
  DataHubModuleName = DataHubModuleName;
  DataHubModuleStatus = DataHubModuleStatus;
  sub = new Subscription();
  machineInformation: MachineInformation;
  adapter: NetworkAdapter;
  adapterConnection: AdapterConnection;
  dataHubsModules: ObjectMap<DataHubModule>;
  registration: boolean;

  constructor(
    private commissioningService: CommissioningService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.commissioningService.machineInformation.subscribe((x) =>
        this.onMachineInformation(x)
      )
    );
    this.sub.add(
      this.commissioningService.registration.subscribe(
        (x) => (this.registration = x)
      )
    );
    this.sub.add(
      this.commissioningService.adapter.subscribe((x) => this.onAdapter(x))
    );
    this.sub.add(
      this.commissioningService.adapterConnection.subscribe((x) =>
        this.onAdapterConnection(x)
      )
    );
    this.sub.add(
      this.commissioningService.dataHubsModules.subscribe((x) =>
        this.onDataHubsModules(x)
      )
    );

    this.commissioningService.getMachineInformation();
    this.commissioningService.getRegistration();
    this.commissioningService.getAdapter();
    this.commissioningService.getAdapterConnection();
    for (const name of Object.values(DataHubModuleName)) {
      this.commissioningService.getDataHubModule(name);
    }
  }

  async onSkip() {
    await this.commissioningService
      .skip()
      .then(() => this.router.navigate(['/']));
  }

  async onApply() {
    await this.commissioningService
      .apply()
      .then(() => this.router.navigate(['/']));
  }

  isEmptyMachineInformation(): boolean {
    if (
      !this.machineInformation ||
      Object.keys(this.machineInformation).length === 0
    )
      return true;

    return (
      !this.machineInformation.Serial ||
      !this.machineInformation.ControlManufacturer ||
      !this.machineInformation.ControlType ||
      !this.machineInformation.Model
    );
  }

  isEmptyAdapter(): boolean {
    if (!this.adapter || Object.keys(this.adapter).length === 0) return true;

    return (
      !this.adapter.macAddress ||
      !this.adapter.ipv4Settings?.ipAddresses[0]?.Address ||
      !this.adapter.ipv4Settings?.ipAddresses[0]?.Netmask
    );
  }

  isConnected() {
    if (
      !this.adapterConnection?.linkStatus ||
      !this.adapterConnection?.configurationStatus
    ) {
      return undefined;
    }
    return (
      this.adapterConnection?.linkStatus === LinkStatus.Connected &&
      this.adapterConnection?.configurationStatus ===
        ConfigurationStatus.Configured
    );
  }

  isModulesRunning() {
    if (!this.dataHubsModules || Object.keys(this.dataHubsModules).length === 0)
      return false;

    return Object.values(this.dataHubsModules).every(
      (x) => x?.Version !== '' && x?.Status === DataHubModuleStatus.Running
    );
  }

  private onMachineInformation(x: MachineInformation) {
    this.machineInformation = { ...x };
  }

  private onAdapter(x: NetworkAdapter) {
    this.adapter = { ...x };
  }

  private onAdapterConnection(x: AdapterConnection) {
    this.adapterConnection = { ...x };
  }

  private onDataHubsModules(x: ObjectMap<DataHubModule>) {
    this.dataHubsModules = { ...x };
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
