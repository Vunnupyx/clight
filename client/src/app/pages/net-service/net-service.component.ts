import { Component, OnInit } from '@angular/core';
import { NetServiceService } from 'app/services';
import { Subscription } from 'rxjs';
import {
  NetServiceStatus,
  ServiceStatus,
  UpdateStatus,
  CentralServer
} from 'app/models';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { IP_REGEX, PORT_REGEX, HOST_REGEX } from 'app/shared/utils/regex';

@Component({
  selector: 'app-net-service',
  templateUrl: './net-service.component.html',
  styleUrls: ['./net-service.component.scss']
})
export class NetServiceComponent implements OnInit {
  ServiceStatus = ServiceStatus;
  UpdateStatus = UpdateStatus;
  sub = new Subscription();

  ipOrHostRegex = `${IP_REGEX}|${HOST_REGEX}`;
  portRegex = PORT_REGEX;
  netServiceStatus: NetServiceStatus;
  centralServer: CentralServer = {
    url: '',
    port: null
  };

  get NETServiceLoginHref() {
    return `${window.location.protocol}//${window.location.hostname}/netservice/ccw/index.html#/login`;
  }

  get supportHref() {
    return `${window.location.protocol}//${
      window.location.hostname
    }/help${this.translate.instant(
      'common.LanguageDocumentationPath'
    )}/docs/NETservice`;
  }

  constructor(
    private netServiceService: NetServiceService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.netServiceService.netServiceStatus.subscribe((x) =>
        this.onNetServiceStatus(x)
      )
    );

    this.netServiceService
      .getNetServiceStatus()
      .then(() =>
        this.netServiceService.getStatusIcon(this.netServiceStatus.StatusIcon)
      );
  }

  openNETServiceLogin() {
    window.open(this.NETServiceLoginHref, '_blank');
  }

  getConnectedClients() {
    if (
      !this.netServiceStatus ||
      Object.keys(this.netServiceStatus).length === 0
    )
      return undefined;

    return this.netServiceStatus.ConnectedClients?.join(', ');
  }

  isEmptyConnectedClients(): boolean {
    if (
      !this.netServiceStatus ||
      Object.keys(this.netServiceStatus).length === 0
    )
      return true;
    return (
      !Array.isArray(this.netServiceStatus.ConnectedClients) ||
      this.netServiceStatus.ConnectedClients?.length === 0
    );
  }

  facilityTreeReset() {
    this.netServiceService.facilityTreeReset();
  }

  onSave(form: NgForm) {
    this.netServiceService
      .updateCentralServer(this.centralServer)
      .then(() => form.resetForm(this.centralServer));
  }

  private onNetServiceStatus(x: NetServiceStatus) {
    this.netServiceStatus = { ...x };
  }

  ngOnDestroy() {
    this.netServiceService.revert();
    this.sub.unsubscribe();
  }
}
