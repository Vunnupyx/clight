import { Component, Input } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
export class DmgHeaderComponent {
    constructor(route, router) {
        this.route = route;
        this.router = router;
        this.includeLayout = true;
        this.header = '';
        this.subheader = '';
    }
    ngOnInit() {
        this.route.url.subscribe(() => {
            this.setHeadings();
        });
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(e => {
            this.setHeadings();
        });
    }
    setHeadings() {
        if (this.route.snapshot.firstChild && this.route.snapshot.firstChild.data) {
            let data = this.route.snapshot.firstChild.data;
            if (data.header)
                this.header = data.header;
            if (data.subheader)
                this.subheader = data.subheader;
        }
    }
}
DmgHeaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DmgHeaderComponent, deps: [{ token: i1.ActivatedRoute }, { token: i1.Router }], target: i0.ɵɵFactoryTarget.Component });
DmgHeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: DmgHeaderComponent, selector: "dmg-header", inputs: { includeLayout: "includeLayout" }, ngImport: i0, template: "<div>\n  <div class=\"headline\">\n    <div class=\"header\">{{header}}</div>\n    <div class=\"subheader\">{{subheader}}</div>\n  </div>\n  <hr />\n  <div [class]=\"{'celos-layout' : includeLayout}\">\n    <ng-content></ng-content>\n  </div>\n</div>\n", styles: [".headline{margin-left:35px}.header{font-size:32px;font-weight:bold;margin-top:28px}.subheader{color:#9e9e9e;font-size:24px;font-weight:600;margin:2px 0}hr{border:none;border-top:1px solid black;margin:0}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DmgHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dmg-header', template: "<div>\n  <div class=\"headline\">\n    <div class=\"header\">{{header}}</div>\n    <div class=\"subheader\">{{subheader}}</div>\n  </div>\n  <hr />\n  <div [class]=\"{'celos-layout' : includeLayout}\">\n    <ng-content></ng-content>\n  </div>\n</div>\n", styles: [".headline{margin-left:35px}.header{font-size:32px;font-weight:bold;margin-top:28px}.subheader{color:#9e9e9e;font-size:24px;font-weight:600;margin:2px 0}hr{border:none;border-top:1px solid black;margin:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.ActivatedRoute }, { type: i1.Router }]; }, propDecorators: { includeLayout: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG1nLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC10aGVtZS9tYXRlcmlhbC10aGVtZS9zcmMvbGliL2xheW91dC9kbWctaGVhZGVyL2RtZy1oZWFkZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtdGhlbWUvbWF0ZXJpYWwtdGhlbWUvc3JjL2xpYi9sYXlvdXQvZG1nLWhlYWRlci9kbWctaGVhZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBa0IsYUFBYSxFQUFVLE1BQU0saUJBQWlCLENBQUM7QUFDeEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFPeEMsTUFBTSxPQUFPLGtCQUFrQjtJQU83QixZQUFvQixLQUFxQixFQUFVLE1BQWM7UUFBN0MsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSmpFLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBRTlCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDcEIsY0FBUyxHQUFXLEVBQUUsQ0FBQztJQUM4QyxDQUFDO0lBRXRFLFFBQVE7UUFDTixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFlBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckYsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFdBQVc7UUFDakIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtZQUN6RSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQy9DLElBQUksSUFBSSxDQUFDLE1BQU07Z0JBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzNDLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3JEO0lBQ0gsQ0FBQzs7K0dBeEJVLGtCQUFrQjttR0FBbEIsa0JBQWtCLDhGQ1QvQiw4UEFVQTsyRkREYSxrQkFBa0I7a0JBTDlCLFNBQVM7K0JBQ0UsWUFBWTswSEFPdEIsYUFBYTtzQkFEWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgTmF2aWdhdGlvbkVuZCwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZG1nLWhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kbWctaGVhZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZG1nLWhlYWRlci5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIERtZ0hlYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KClcbiAgaW5jbHVkZUxheW91dDogYm9vbGVhbiA9IHRydWU7XG5cbiAgaGVhZGVyOiBzdHJpbmcgPSAnJztcbiAgc3ViaGVhZGVyOiBzdHJpbmcgPSAnJztcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHsgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMucm91dGUudXJsLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldEhlYWRpbmdzKCk7XG4gICAgfSlcbiAgICB0aGlzLnJvdXRlci5ldmVudHMucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSkuc3Vic2NyaWJlKGUgPT4ge1xuICAgICAgdGhpcy5zZXRIZWFkaW5ncygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRIZWFkaW5ncygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb3V0ZS5zbmFwc2hvdC5maXJzdENoaWxkICYmIHRoaXMucm91dGUuc25hcHNob3QuZmlyc3RDaGlsZC5kYXRhKSB7XG4gICAgICBsZXQgZGF0YSA9IHRoaXMucm91dGUuc25hcHNob3QuZmlyc3RDaGlsZC5kYXRhO1xuICAgICAgaWYgKGRhdGEuaGVhZGVyKSB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgaWYgKGRhdGEuc3ViaGVhZGVyKSB0aGlzLnN1YmhlYWRlciA9IGRhdGEuc3ViaGVhZGVyO1xuICAgIH1cbiAgfVxuXG59XG4iLCI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiaGVhZGxpbmVcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+e3toZWFkZXJ9fTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzdWJoZWFkZXJcIj57e3N1YmhlYWRlcn19PC9kaXY+XG4gIDwvZGl2PlxuICA8aHIgLz5cbiAgPGRpdiBbY2xhc3NdPVwieydjZWxvcy1sYXlvdXQnIDogaW5jbHVkZUxheW91dH1cIj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=