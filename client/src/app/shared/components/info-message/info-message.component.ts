import { Component, Input } from '@angular/core';

@Component({
  selector: 'info-message',
  templateUrl: './info-message.component.html',
  styleUrls: ['./info-message.component.scss']
})
export class InfoMessageComponent {
  @Input() title!: string;
  @Input() message!: string;
}
