import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'dmg-header',
  templateUrl: './dmg-header.component.html',
  styleUrls: ['./dmg-header.component.scss']
})
export class DmgHeaderComponent implements OnInit {

  @Input()
  includeLayout: boolean = true;

  header: string = '';
  subheader: string = '';
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      this.setHeadings();
    })
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(e => {
      this.setHeadings();
    });
  }

  private setHeadings(): void {
    if (this.route.snapshot.firstChild && this.route.snapshot.firstChild.data) {
      let data = this.route.snapshot.firstChild.data;
      if (data.header) this.header = data.header;
      if (data.subheader) this.subheader = data.subheader;
    }
  }

}
