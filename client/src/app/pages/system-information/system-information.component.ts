import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SystemInformationService } from '../../services';
import { SystemInformationSection } from "../../models";

@Component({
  selector: 'app-system-information',
  templateUrl: './system-information.component.html',
  styleUrls: ['./system-information.component.scss']
})
export class SystemInformationComponent implements OnInit {

  data: SystemInformationSection[] = [];

  private sub: Subscription = new Subscription();

  constructor(private systemInformationService: SystemInformationService) {}

  ngOnInit(): void {
    this.sub.add(
      this.systemInformationService.sections.subscribe(x => this.onData(x))
    )

    this.systemInformationService.getInfo();
  }

  private onData(x: SystemInformationSection[]) {
    this.data = x;
  }
}
