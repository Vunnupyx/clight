import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SystemInformationService } from '../../services';
import { SystemInformationSection } from '../../models';
import { environment } from '../../../environments/environment';
import { MaterialThemeVersion } from 'app/app.component';

@Component({
  selector: 'app-system-information',
  templateUrl: './system-information.component.html',
  styleUrls: ['./system-information.component.scss']
})
export class SystemInformationComponent implements OnInit, OnDestroy {
  readonly MaterialThemeVersion = MaterialThemeVersion;
  
  data: SystemInformationSection[] = [];

  private sub: Subscription = new Subscription();

  constructor(private systemInformationService: SystemInformationService) {}

  ngOnInit(): void {
    this.sub.add(
      this.systemInformationService.sections.subscribe((x) => this.onData(x))
    );

    this.systemInformationService.getInfo();
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  private onData(x: SystemInformationSection[]) {
    // replace web ui version

    const modifiedData = JSON.parse(
      JSON.stringify(x).replace(
        '$ui_version$',
        environment.version || 'unknown'
      )
    );

    this.data = modifiedData;
  }
}
