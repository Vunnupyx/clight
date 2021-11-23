import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-btn',
  templateUrl: './doc-btn.component.html',
  styleUrls: ['./doc-btn.component.scss']
})
export class DocBtnComponent implements OnInit {
  @Input() link!: string;
  @Input() tooltip!: string;

  constructor() {}

  ngOnInit(): void {}

  open() {
    window.open(this.link, '_blank');
  }
}
