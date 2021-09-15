import { Component, OnInit, SimpleChanges } from '@angular/core'

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  currentLanguage: string = ''

  constructor() { }

  ngOnInit(): void {
    this.currentLanguage = 'en'
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  chooseLanguage($event: Event) {
    console.log($event)
    // this.currentLanguage =
  }
}
