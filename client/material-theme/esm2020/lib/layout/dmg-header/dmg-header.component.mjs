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
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
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
DmgHeaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: DmgHeaderComponent, deps: [{ token: i1.ActivatedRoute }, { token: i1.Router }], target: i0.ɵɵFactoryTarget.Component });
DmgHeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.2", type: DmgHeaderComponent, selector: "dmg-header", inputs: { includeLayout: "includeLayout" }, ngImport: i0, template: "<div>\n  <div class=\"headline\">\n    <div class=\"header\">{{header}}</div>\n    <div class=\"subheader\">{{subheader}}</div>\n  </div>\n  <hr />\n  <div [class]=\"{'celos-layout' : includeLayout}\">\n    <ng-content></ng-content>\n  </div>\n</div>\n", styles: [".headline{margin-left:35px}.header{font-size:32px;font-weight:700;margin-top:28px}.subheader{color:#9e9e9e;font-size:24px;font-weight:600;margin:2px 0}hr{border:none;border-top:1px solid black;margin:0}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: DmgHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dmg-header', template: "<div>\n  <div class=\"headline\">\n    <div class=\"header\">{{header}}</div>\n    <div class=\"subheader\">{{subheader}}</div>\n  </div>\n  <hr />\n  <div [class]=\"{'celos-layout' : includeLayout}\">\n    <ng-content></ng-content>\n  </div>\n</div>\n", styles: [".headline{margin-left:35px}.header{font-size:32px;font-weight:700;margin-top:28px}.subheader{color:#9e9e9e;font-size:24px;font-weight:600;margin:2px 0}hr{border:none;border-top:1px solid black;margin:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.ActivatedRoute }, { type: i1.Router }]; }, propDecorators: { includeLayout: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG1nLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC10aGVtZS9tYXRlcmlhbC10aGVtZS9zcmMvbGliL2xheW91dC9kbWctaGVhZGVyL2RtZy1oZWFkZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtdGhlbWUvbWF0ZXJpYWwtdGhlbWUvc3JjL2xpYi9sYXlvdXQvZG1nLWhlYWRlci9kbWctaGVhZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBa0IsYUFBYSxFQUFVLE1BQU0saUJBQWlCLENBQUM7QUFDeEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFPeEMsTUFBTSxPQUFPLGtCQUFrQjtJQU83QixZQUFvQixLQUFxQixFQUFVLE1BQWM7UUFBN0MsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSmpFLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBRTlCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDcEIsY0FBUyxHQUFXLEVBQUUsQ0FBQztJQUM4QyxDQUFDO0lBRXRFLFFBQVE7UUFDTixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFlBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3RGLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxXQUFXO1FBQ2pCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDekUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUMvQyxJQUFJLElBQUksQ0FBQyxNQUFNO2dCQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQyxJQUFJLElBQUksQ0FBQyxTQUFTO2dCQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNyRDtJQUNILENBQUM7OytHQXhCVSxrQkFBa0I7bUdBQWxCLGtCQUFrQiw4RkNUL0IsOFBBVUE7MkZERGEsa0JBQWtCO2tCQUw5QixTQUFTOytCQUNFLFlBQVk7MEhBT3RCLGFBQWE7c0JBRFosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIE5hdmlnYXRpb25FbmQsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RtZy1oZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZG1nLWhlYWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2RtZy1oZWFkZXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBEbWdIZWFkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgpXG4gIGluY2x1ZGVMYXlvdXQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGhlYWRlcjogc3RyaW5nID0gJyc7XG4gIHN1YmhlYWRlcjogc3RyaW5nID0gJyc7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7IH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlLnVybC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRIZWFkaW5ncygpO1xuICAgIH0pXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldEhlYWRpbmdzKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldEhlYWRpbmdzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvdXRlLnNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgdGhpcy5yb3V0ZS5zbmFwc2hvdC5maXJzdENoaWxkLmRhdGEpIHtcbiAgICAgIGxldCBkYXRhID0gdGhpcy5yb3V0ZS5zbmFwc2hvdC5maXJzdENoaWxkLmRhdGE7XG4gICAgICBpZiAoZGF0YS5oZWFkZXIpIHRoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICBpZiAoZGF0YS5zdWJoZWFkZXIpIHRoaXMuc3ViaGVhZGVyID0gZGF0YS5zdWJoZWFkZXI7XG4gICAgfVxuICB9XG5cbn1cbiIsIjxkaXY+XG4gIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj57e2hlYWRlcn19PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInN1YmhlYWRlclwiPnt7c3ViaGVhZGVyfX08L2Rpdj5cbiAgPC9kaXY+XG4gIDxociAvPlxuICA8ZGl2IFtjbGFzc109XCJ7J2NlbG9zLWxheW91dCcgOiBpbmNsdWRlTGF5b3V0fVwiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==