import { Component, OnInit } from '@angular/core';
import { CommissioningService } from 'app/services';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  Adapter,
  AdapterConnection,
  ConfigurationStatus,
  DataHubModule,
  DataHubModuleName,
  DataHubModuleStatus,
  LinkStatus,
  MachineInformation
} from 'app/models/commissioning';
import { ObjectMap } from 'app/shared/utils';

@Component({
  selector: 'app-commissioning',
  templateUrl: './commissioning.component.html',
  styleUrls: ['./commissioning.component.scss']
})
export class CommissioningComponent implements OnInit {
  DataHubModuleName = DataHubModuleName;
  sub = new Subscription();
  machineInformation: MachineInformation;
  finished: boolean;
  adapter: Adapter;
  adapterConnection: AdapterConnection;
  dataHubsModules: ObjectMap<DataHubModule>;
  registration: boolean;

  constructor(
    private commissioningService: CommissioningService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.commissioningService.finished.subscribe((x) => (this.finished = x))
    );
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

  async onApply() {
    await this.commissioningService
      .apply()
      .then(() => this.router.navigate(['/']));
  }

  isEmpty(obj: Record<string, any>): boolean {
    if (!obj || Object.keys(obj).length === 0) return true;

    return Object.values(obj).some((x) => x === '');
  }

  isConnected() {
    return (
      this.adapterConnection.linkStatus === LinkStatus.Connected &&
      this.adapterConnection.configurationStatus ===
        ConfigurationStatus.Configured
    );
  }

  isModulesRunning() {
    if (this.isEmpty(this.dataHubsModules)) return false;

    return Object.values(this.dataHubsModules).every(
      (x) => x?.Version !== '' && x?.Status === DataHubModuleStatus.Running
    );
  }

  private onMachineInformation(x: MachineInformation) {
    this.machineInformation = { ...x };
  }

  private onAdapter(x: Adapter) {
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
