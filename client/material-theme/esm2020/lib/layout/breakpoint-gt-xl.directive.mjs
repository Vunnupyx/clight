import { Directive } from '@angular/core';
import { ClassDirective, FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ImgSrcDirective, LayoutDirective, ShowHideDirective, StyleDirective } from "@angular/flex-layout";
import * as i0 from "@angular/core";
const layoutInputs = ['fxLayout.gt-xl'];
const hideInputs = ['fxHide.gt-xl'];
const showInputs = ['fxShow.gt-xl'];
const classInputs = ['ngClass.gt-xl'];
const styleInputs = ['ngStyle.gt-xl'];
const imgInputs = ['imgSrc.gt-xl'];
const flexInputs = ['fxFlex.gt-xl'];
const orderInputs = ['fxFlexOrder.gt-xl'];
const offsetInputs = ['fxFlexOffset.gt-xl'];
const flexAlignInputs = ['fxFlexAlign.gt-xl'];
const fillInputs = ['fxFlexFill.gt-xl', 'fxFill.gt-xl'];
export class BreakpointLayoutGtXlDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInputs;
    }
}
BreakpointLayoutGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointLayoutGtXlDirective, selector: "[fxLayout.lt-xs]", inputs: { "fxLayout.gt-xl": "fxLayout.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.lt-xs]`, inputs: layoutInputs
                }]
        }] });
export class BreakpointHideGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs;
    }
}
BreakpointHideGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointHideGtXlDirective, selector: "[fxHide.gt-xl]", inputs: { "fxHide.gt-xl": "fxHide.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.gt-xl]`, inputs: hideInputs
                }]
        }] });
export class BreakpointShowGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs;
    }
}
BreakpointShowGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointShowGtXlDirective, selector: "[fxShow.gt-xl]", inputs: { "fxShow.gt-xl": "fxShow.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.gt-xl]`, inputs: showInputs
                }]
        }] });
export class BreakpointClassGtXlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs;
    }
}
BreakpointClassGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointClassGtXlDirective, selector: "[ngClass.gt-xl]", inputs: { "ngClass.gt-xl": "ngClass.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.gt-xl]`, inputs: classInputs
                }]
        }] });
export class BreakpointStyleGtXlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs;
    }
}
BreakpointStyleGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointStyleGtXlDirective, selector: "[ngStyle.gt-xl]", inputs: { "ngStyle.gt-xl": "ngStyle.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.gt-xl]`, inputs: styleInputs
                }]
        }] });
export class BreakpointImgSrcGtXlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs;
    }
}
BreakpointImgSrcGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointImgSrcGtXlDirective, selector: "[imgSrc.gt-xl]", inputs: { "imgSrc.gt-xl": "imgSrc.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.gt-xl]`, inputs: imgInputs
                }]
        }] });
export class BreakpointFlexGtXlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs;
    }
}
BreakpointFlexGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexGtXlDirective, selector: "[fxFlex.gt-xl]", inputs: { "fxFlex.gt-xl": "fxFlex.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.gt-xl]`, inputs: flexInputs
                }]
        }] });
export class BreakpointOrderGtXlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs;
    }
}
BreakpointOrderGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOrderGtXlDirective, selector: "[fxFlexOrder.gt-xl]", inputs: { "fxFlexOrder.gt-xl": "fxFlexOrder.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.gt-xl]`, inputs: orderInputs
                }]
        }] });
export class BreakpointOffsetGtXlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs;
    }
}
BreakpointOffsetGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOffsetGtXlDirective, selector: "[fxFlexOffset.gt-xl]", inputs: { "fxFlexOffset.gt-xl": "fxFlexOffset.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.gt-xl]`, inputs: offsetInputs
                }]
        }] });
export class BreakpointFlexAlignGtXlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs;
    }
}
BreakpointFlexAlignGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexAlignGtXlDirective, selector: "[fxFlexAlign.gt-xl]", inputs: { "fxFlexAlign.gt-xl": "fxFlexAlign.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.gt-xl]`, inputs: flexAlignInputs
                }]
        }] });
export class BreakpointFillGtXlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs;
    }
}
BreakpointFillGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFillGtXlDirective, selector: "[fxFlexFill.gt-xl]", inputs: { "fxFlexFill.gt-xl": "fxFlexFill.gt-xl", "fxFill.gt-xl": "fxFill.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.gt-xl]`, inputs: fillInputs
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC1ndC14bC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC10aGVtZS9tYXRlcmlhbC10aGVtZS9zcmMvbGliL2xheW91dC9icmVha3BvaW50LWd0LXhsLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFDTCxjQUFjLEVBQUUsa0JBQWtCLEVBQ2xDLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFDckQsa0JBQWtCLEVBQ2xCLGVBQWUsRUFBRSxlQUFlLEVBQ2hDLGlCQUFpQixFQUNqQixjQUFjLEVBQ2YsTUFBTSxzQkFBc0IsQ0FBQzs7QUFFOUIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sVUFBVSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxNQUFNLFdBQVcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sV0FBVyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuQyxNQUFNLFVBQVUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sV0FBVyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUMxQyxNQUFNLFlBQVksR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDNUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sVUFBVSxHQUFHLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFLeEQsTUFBTSxPQUFPLDZCQUE4QixTQUFRLGVBQWU7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QU8sMkJBQTRCLFNBQVEsaUJBQWlCO0lBSGxFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7S0FDL0I7O3dIQUZZLDJCQUEyQjs0R0FBM0IsMkJBQTJCOzJGQUEzQiwyQkFBMkI7a0JBSHZDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxVQUFVO2lCQUNuRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2xhc3NEaXJlY3RpdmUsIEZsZXhBbGlnbkRpcmVjdGl2ZSxcbiAgRmxleERpcmVjdGl2ZSwgRmxleEZpbGxEaXJlY3RpdmUsIEZsZXhPZmZzZXREaXJlY3RpdmUsXG4gIEZsZXhPcmRlckRpcmVjdGl2ZSxcbiAgSW1nU3JjRGlyZWN0aXZlLCBMYXlvdXREaXJlY3RpdmUsXG4gIFNob3dIaWRlRGlyZWN0aXZlLFxuICBTdHlsZURpcmVjdGl2ZVxufSBmcm9tIFwiQGFuZ3VsYXIvZmxleC1sYXlvdXRcIjtcblxuY29uc3QgbGF5b3V0SW5wdXRzID0gWydmeExheW91dC5ndC14bCddO1xuY29uc3QgaGlkZUlucHV0cyA9IFsnZnhIaWRlLmd0LXhsJ107XG5jb25zdCBzaG93SW5wdXRzID0gWydmeFNob3cuZ3QteGwnXTtcbmNvbnN0IGNsYXNzSW5wdXRzID0gWyduZ0NsYXNzLmd0LXhsJ107XG5jb25zdCBzdHlsZUlucHV0cyA9IFsnbmdTdHlsZS5ndC14bCddO1xuY29uc3QgaW1nSW5wdXRzID0gWydpbWdTcmMuZ3QteGwnXTtcbmNvbnN0IGZsZXhJbnB1dHMgPSBbJ2Z4RmxleC5ndC14bCddO1xuY29uc3Qgb3JkZXJJbnB1dHMgPSBbJ2Z4RmxleE9yZGVyLmd0LXhsJ107XG5jb25zdCBvZmZzZXRJbnB1dHMgPSBbJ2Z4RmxleE9mZnNldC5ndC14bCddO1xuY29uc3QgZmxleEFsaWduSW5wdXRzID0gWydmeEZsZXhBbGlnbi5ndC14bCddO1xuY29uc3QgZmlsbElucHV0cyA9IFsnZnhGbGV4RmlsbC5ndC14bCcsICdmeEZpbGwuZ3QteGwnXTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4TGF5b3V0Lmx0LXhzXWAsIGlucHV0czogbGF5b3V0SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRMYXlvdXRHdFhsRGlyZWN0aXZlIGV4dGVuZHMgTGF5b3V0RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGxheW91dElucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4SGlkZS5ndC14bF1gLCBpbnB1dHM6IGhpZGVJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEhpZGVHdFhsRGlyZWN0aXZlIGV4dGVuZHMgU2hvd0hpZGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaGlkZUlucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4U2hvdy5ndC14bF1gLCBpbnB1dHM6IHNob3dJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFNob3dHdFhsRGlyZWN0aXZlIGV4dGVuZHMgU2hvd0hpZGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc2hvd0lucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW25nQ2xhc3MuZ3QteGxdYCwgaW5wdXRzOiBjbGFzc0lucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50Q2xhc3NHdFhsRGlyZWN0aXZlIGV4dGVuZHMgQ2xhc3NEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gY2xhc3NJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtuZ1N0eWxlLmd0LXhsXWAsIGlucHV0czogc3R5bGVJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFN0eWxlR3RYbERpcmVjdGl2ZSBleHRlbmRzIFN0eWxlRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IHN0eWxlSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbaW1nU3JjLmd0LXhsXWAsIGlucHV0czogaW1nSW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRJbWdTcmNHdFhsRGlyZWN0aXZlIGV4dGVuZHMgSW1nU3JjRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGltZ0lucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleC5ndC14bF1gLCBpbnB1dHM6IGZsZXhJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZsZXhHdFhsRGlyZWN0aXZlIGV4dGVuZHMgRmxleERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBmbGV4SW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4T3JkZXIuZ3QteGxdYCwgaW5wdXRzOiBvcmRlcklucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T3JkZXJHdFhsRGlyZWN0aXZlIGV4dGVuZHMgRmxleE9yZGVyRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IG9yZGVySW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4T2Zmc2V0Lmd0LXhsXWAsIGlucHV0czogb2Zmc2V0SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRPZmZzZXRHdFhsRGlyZWN0aXZlIGV4dGVuZHMgRmxleE9mZnNldERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBvZmZzZXRJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhBbGlnbi5ndC14bF1gLCBpbnB1dHM6IGZsZXhBbGlnbklucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmxleEFsaWduR3RYbERpcmVjdGl2ZSBleHRlbmRzIEZsZXhBbGlnbkRpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBmbGV4QWxpZ25JbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhGaWxsLmd0LXhsXWAsIGlucHV0czogZmlsbElucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmlsbEd0WGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4RmlsbERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBmaWxsSW5wdXRzO1xufVxuIl19