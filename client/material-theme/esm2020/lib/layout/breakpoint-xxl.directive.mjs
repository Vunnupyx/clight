import { Directive } from '@angular/core';
import { ClassDirective, FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ImgSrcDirective, LayoutDirective, ShowHideDirective, StyleDirective } from "@angular/flex-layout";
import * as i0 from "@angular/core";
const layoutInputs = ['fxLayout.xxl'];
const hideInputs = ['fxHide.xxl'];
const showInputs = ['fxShow.xxl'];
const classInputs = ['ngClass.xxl'];
const styleInputs = ['ngStyle.xxl'];
const imgInputs = ['imgSrc.xxl'];
const flexInputs = ['fxFlex.xxl'];
const orderInputs = ['fxFlexOrder.xxl'];
const offsetInputs = ['fxFlexOffset.xxl'];
const flexAlignInputs = ['fxFlexAlign.xxl'];
const fillInputs = ['fxFlexFill.xxl', 'fxFill.xxl'];
export class BreakpointLayoutXxlDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInputs;
    }
}
BreakpointLayoutXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointLayoutXxlDirective, selector: "[fxLayout.xxl]", inputs: { "fxLayout.xxl": "fxLayout.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.xxl]`, inputs: layoutInputs
                }]
        }] });
export class BreakpointHideXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs;
    }
}
BreakpointHideXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointHideXxlDirective, selector: "[fxHide.xxl]", inputs: { "fxHide.xxl": "fxHide.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.xxl]`, inputs: hideInputs
                }]
        }] });
export class BreakpointShowXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs;
    }
}
BreakpointShowXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointShowXxlDirective, selector: "[fxShow.xxl]", inputs: { "fxShow.xxl": "fxShow.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.xxl]`, inputs: showInputs
                }]
        }] });
export class BreakpointClassXxlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs;
    }
}
BreakpointClassXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointClassXxlDirective, selector: "[ngClass.xxl]", inputs: { "ngClass.xxl": "ngClass.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.xxl]`, inputs: classInputs
                }]
        }] });
export class BreakpointStyleXxlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs;
    }
}
BreakpointStyleXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointStyleXxlDirective, selector: "[ngStyle.xxl]", inputs: { "ngStyle.xxl": "ngStyle.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.xxl]`, inputs: styleInputs
                }]
        }] });
export class BreakpointImgSrcXxlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs;
    }
}
BreakpointImgSrcXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointImgSrcXxlDirective, selector: "[imgSrc.xxl]", inputs: { "imgSrc.xxl": "imgSrc.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.xxl]`, inputs: imgInputs
                }]
        }] });
export class BreakpointFlexXxlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs;
    }
}
BreakpointFlexXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexXxlDirective, selector: "[fxFlex.xxl]", inputs: { "fxFlex.xxl": "fxFlex.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.xxl]`, inputs: flexInputs
                }]
        }] });
export class BreakpointOrderXxlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs;
    }
}
BreakpointOrderXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOrderXxlDirective, selector: "[fxFlexOrder.xxl]", inputs: { "fxFlexOrder.xxl": "fxFlexOrder.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.xxl]`, inputs: orderInputs
                }]
        }] });
export class BreakpointOffsetXxlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs;
    }
}
BreakpointOffsetXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOffsetXxlDirective, selector: "[fxFlexOffset.xxl]", inputs: { "fxFlexOffset.xxl": "fxFlexOffset.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.xxl]`, inputs: offsetInputs
                }]
        }] });
export class BreakpointFlexAlignXxlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs;
    }
}
BreakpointFlexAlignXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexAlignXxlDirective, selector: "[fxFlexAlign.xxl]", inputs: { "fxFlexAlign.xxl": "fxFlexAlign.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.xxl]`, inputs: flexAlignInputs
                }]
        }] });
export class BreakpointFillXxlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs;
    }
}
BreakpointFillXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFillXxlDirective, selector: "[fxFlexFill.xxl]", inputs: { "fxFlexFill.xxl": "fxFlexFill.xxl", "fxFill.xxl": "fxFill.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.xxl]`, inputs: fillInputs
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC14eGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtdGhlbWUvbWF0ZXJpYWwtdGhlbWUvc3JjL2xpYi9sYXlvdXQvYnJlYWtwb2ludC14eGwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUNMLGNBQWMsRUFBRSxrQkFBa0IsRUFDbEMsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUNyRCxrQkFBa0IsRUFDbEIsZUFBZSxFQUFFLGVBQWUsRUFDaEMsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZixNQUFNLHNCQUFzQixDQUFDOztBQUU5QixNQUFNLFlBQVksR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sVUFBVSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxNQUFNLFdBQVcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sV0FBVyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqQyxNQUFNLFVBQVUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4QyxNQUFNLFlBQVksR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzVDLE1BQU0sVUFBVSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFNcEQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGVBQWU7SUFIakU7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QWlCO0lBSGpFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7S0FDL0I7O3VIQUZZLDBCQUEwQjsyR0FBMUIsMEJBQTBCOzJGQUExQiwwQkFBMEI7a0JBSHRDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxVQUFVO2lCQUNqRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2xhc3NEaXJlY3RpdmUsIEZsZXhBbGlnbkRpcmVjdGl2ZSxcbiAgRmxleERpcmVjdGl2ZSwgRmxleEZpbGxEaXJlY3RpdmUsIEZsZXhPZmZzZXREaXJlY3RpdmUsXG4gIEZsZXhPcmRlckRpcmVjdGl2ZSxcbiAgSW1nU3JjRGlyZWN0aXZlLCBMYXlvdXREaXJlY3RpdmUsXG4gIFNob3dIaWRlRGlyZWN0aXZlLFxuICBTdHlsZURpcmVjdGl2ZVxufSBmcm9tIFwiQGFuZ3VsYXIvZmxleC1sYXlvdXRcIjtcblxuY29uc3QgbGF5b3V0SW5wdXRzID0gWydmeExheW91dC54eGwnXTtcbmNvbnN0IGhpZGVJbnB1dHMgPSBbJ2Z4SGlkZS54eGwnXTtcbmNvbnN0IHNob3dJbnB1dHMgPSBbJ2Z4U2hvdy54eGwnXTtcbmNvbnN0IGNsYXNzSW5wdXRzID0gWyduZ0NsYXNzLnh4bCddO1xuY29uc3Qgc3R5bGVJbnB1dHMgPSBbJ25nU3R5bGUueHhsJ107XG5jb25zdCBpbWdJbnB1dHMgPSBbJ2ltZ1NyYy54eGwnXTtcbmNvbnN0IGZsZXhJbnB1dHMgPSBbJ2Z4RmxleC54eGwnXTtcbmNvbnN0IG9yZGVySW5wdXRzID0gWydmeEZsZXhPcmRlci54eGwnXTtcbmNvbnN0IG9mZnNldElucHV0cyA9IFsnZnhGbGV4T2Zmc2V0Lnh4bCddO1xuY29uc3QgZmxleEFsaWduSW5wdXRzID0gWydmeEZsZXhBbGlnbi54eGwnXTtcbmNvbnN0IGZpbGxJbnB1dHMgPSBbJ2Z4RmxleEZpbGwueHhsJywgJ2Z4RmlsbC54eGwnXTtcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhMYXlvdXQueHhsXWAsIGlucHV0czogbGF5b3V0SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRMYXlvdXRYeGxEaXJlY3RpdmUgZXh0ZW5kcyBMYXlvdXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gbGF5b3V0SW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhIaWRlLnh4bF1gLCBpbnB1dHM6IGhpZGVJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEhpZGVYeGxEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBoaWRlSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhTaG93Lnh4bF1gLCBpbnB1dHM6IHNob3dJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFNob3dYeGxEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBzaG93SW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdDbGFzcy54eGxdYCwgaW5wdXRzOiBjbGFzc0lucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50Q2xhc3NYeGxEaXJlY3RpdmUgZXh0ZW5kcyBDbGFzc0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBjbGFzc0lucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW25nU3R5bGUueHhsXWAsIGlucHV0czogc3R5bGVJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFN0eWxlWHhsRGlyZWN0aXZlIGV4dGVuZHMgU3R5bGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc3R5bGVJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtpbWdTcmMueHhsXWAsIGlucHV0czogaW1nSW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRJbWdTcmNYeGxEaXJlY3RpdmUgZXh0ZW5kcyBJbWdTcmNEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW1nSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4Lnh4bF1gLCBpbnB1dHM6IGZsZXhJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZsZXhYeGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZsZXhJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhPcmRlci54eGxdYCwgaW5wdXRzOiBvcmRlcklucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T3JkZXJYeGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T3JkZXJEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb3JkZXJJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhPZmZzZXQueHhsXWAsIGlucHV0czogb2Zmc2V0SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRPZmZzZXRYeGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T2Zmc2V0RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IG9mZnNldElucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEFsaWduLnh4bF1gLCBpbnB1dHM6IGZsZXhBbGlnbklucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmxleEFsaWduWHhsRGlyZWN0aXZlIGV4dGVuZHMgRmxleEFsaWduRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZsZXhBbGlnbklucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEZpbGwueHhsXWAsIGlucHV0czogZmlsbElucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmlsbFh4bERpcmVjdGl2ZSBleHRlbmRzIEZsZXhGaWxsRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZpbGxJbnB1dHM7XG59XG4iXX0=