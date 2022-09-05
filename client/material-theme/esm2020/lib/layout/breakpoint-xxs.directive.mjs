import { Directive } from '@angular/core';
import { ClassDirective, FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ImgSrcDirective, LayoutDirective, ShowHideDirective, StyleDirective } from "@angular/flex-layout";
import * as i0 from "@angular/core";
const layoutInputs = ['fxLayout.xxs'];
const hideInputs = ['fxHide.xxs'];
const showInputs = ['fxShow.xxs'];
const classInputs = ['ngClass.xxs'];
const styleInputs = ['ngStyle.xxs'];
const imgInputs = ['imgSrc.xxs'];
const flexInputs = ['fxFlex.xxs'];
const orderInputs = ['fxFlexOrder.xxs'];
const offsetInputs = ['fxFlexOffset.xxs'];
const flexAlignInputs = ['fxFlexAlign.xxs'];
const fillInputs = ['fxFlexFill.xxs', 'fxFill.xxs'];
export class BreakpointLayoutXxsDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInputs;
    }
}
BreakpointLayoutXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointLayoutXxsDirective, selector: "[fxLayout.xxs]", inputs: { "fxLayout.xxs": "fxLayout.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.xxs]`, inputs: layoutInputs
                }]
        }] });
export class BreakpointHideXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs;
    }
}
BreakpointHideXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointHideXxsDirective, selector: "[fxHide.xxs]", inputs: { "fxHide.xxs": "fxHide.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.xxs]`, inputs: hideInputs
                }]
        }] });
export class BreakpointShowXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs;
    }
}
BreakpointShowXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointShowXxsDirective, selector: "[fxShow.xxs]", inputs: { "fxShow.xxs": "fxShow.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.xxs]`, inputs: showInputs
                }]
        }] });
export class BreakpointClassXxsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs;
    }
}
BreakpointClassXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointClassXxsDirective, selector: "[ngClass.xxs]", inputs: { "ngClass.xxs": "ngClass.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.xxs]`, inputs: classInputs
                }]
        }] });
export class BreakpointStyleXxsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs;
    }
}
BreakpointStyleXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointStyleXxsDirective, selector: "[ngStyle.xxs]", inputs: { "ngStyle.xxs": "ngStyle.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.xxs]`, inputs: styleInputs
                }]
        }] });
export class BreakpointImgSrcXxsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs;
    }
}
BreakpointImgSrcXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointImgSrcXxsDirective, selector: "[imgSrc.xxs]", inputs: { "imgSrc.xxs": "imgSrc.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.xxs]`, inputs: imgInputs
                }]
        }] });
export class BreakpointFlexXxsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs;
    }
}
BreakpointFlexXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexXxsDirective, selector: "[fxFlex.xxs]", inputs: { "fxFlex.xxs": "fxFlex.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.xxs]`, inputs: flexInputs
                }]
        }] });
export class BreakpointOrderXxsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs;
    }
}
BreakpointOrderXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOrderXxsDirective, selector: "[fxFlexOrder.xxs]", inputs: { "fxFlexOrder.xxs": "fxFlexOrder.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.xxs]`, inputs: orderInputs
                }]
        }] });
export class BreakpointOffsetXxsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs;
    }
}
BreakpointOffsetXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOffsetXxsDirective, selector: "[fxFlexOffset.xxs]", inputs: { "fxFlexOffset.xxs": "fxFlexOffset.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.xxs]`, inputs: offsetInputs
                }]
        }] });
export class BreakpointFlexAlignXxsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs;
    }
}
BreakpointFlexAlignXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexAlignXxsDirective, selector: "[fxFlexAlign.xxs]", inputs: { "fxFlexAlign.xxs": "fxFlexAlign.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.xxs]`, inputs: flexAlignInputs
                }]
        }] });
export class BreakpointFillXxsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs;
    }
}
BreakpointFillXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFillXxsDirective, selector: "[fxFlexFill.xxs]", inputs: { "fxFlexFill.xxs": "fxFlexFill.xxs", "fxFill.xxs": "fxFill.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.xxs]`, inputs: fillInputs
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC14eHMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtdGhlbWUvbWF0ZXJpYWwtdGhlbWUvc3JjL2xpYi9sYXlvdXQvYnJlYWtwb2ludC14eHMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUNMLGNBQWMsRUFBRSxrQkFBa0IsRUFDbEMsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUNyRCxrQkFBa0IsRUFDbEIsZUFBZSxFQUFFLGVBQWUsRUFDaEMsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZixNQUFNLHNCQUFzQixDQUFDOztBQUU5QixNQUFNLFlBQVksR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sVUFBVSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxNQUFNLFdBQVcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sV0FBVyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqQyxNQUFNLFVBQVUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4QyxNQUFNLFlBQVksR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzVDLE1BQU0sVUFBVSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFNcEQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGVBQWU7SUFIakU7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QWlCO0lBSGpFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7S0FDL0I7O3VIQUZZLDBCQUEwQjsyR0FBMUIsMEJBQTBCOzJGQUExQiwwQkFBMEI7a0JBSHRDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxVQUFVO2lCQUNqRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2xhc3NEaXJlY3RpdmUsIEZsZXhBbGlnbkRpcmVjdGl2ZSxcbiAgRmxleERpcmVjdGl2ZSwgRmxleEZpbGxEaXJlY3RpdmUsIEZsZXhPZmZzZXREaXJlY3RpdmUsXG4gIEZsZXhPcmRlckRpcmVjdGl2ZSxcbiAgSW1nU3JjRGlyZWN0aXZlLCBMYXlvdXREaXJlY3RpdmUsXG4gIFNob3dIaWRlRGlyZWN0aXZlLFxuICBTdHlsZURpcmVjdGl2ZVxufSBmcm9tIFwiQGFuZ3VsYXIvZmxleC1sYXlvdXRcIjtcblxuY29uc3QgbGF5b3V0SW5wdXRzID0gWydmeExheW91dC54eHMnXTtcbmNvbnN0IGhpZGVJbnB1dHMgPSBbJ2Z4SGlkZS54eHMnXTtcbmNvbnN0IHNob3dJbnB1dHMgPSBbJ2Z4U2hvdy54eHMnXTtcbmNvbnN0IGNsYXNzSW5wdXRzID0gWyduZ0NsYXNzLnh4cyddO1xuY29uc3Qgc3R5bGVJbnB1dHMgPSBbJ25nU3R5bGUueHhzJ107XG5jb25zdCBpbWdJbnB1dHMgPSBbJ2ltZ1NyYy54eHMnXTtcbmNvbnN0IGZsZXhJbnB1dHMgPSBbJ2Z4RmxleC54eHMnXTtcbmNvbnN0IG9yZGVySW5wdXRzID0gWydmeEZsZXhPcmRlci54eHMnXTtcbmNvbnN0IG9mZnNldElucHV0cyA9IFsnZnhGbGV4T2Zmc2V0Lnh4cyddO1xuY29uc3QgZmxleEFsaWduSW5wdXRzID0gWydmeEZsZXhBbGlnbi54eHMnXTtcbmNvbnN0IGZpbGxJbnB1dHMgPSBbJ2Z4RmxleEZpbGwueHhzJywgJ2Z4RmlsbC54eHMnXTtcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhMYXlvdXQueHhzXWAsIGlucHV0czogbGF5b3V0SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRMYXlvdXRYeHNEaXJlY3RpdmUgZXh0ZW5kcyBMYXlvdXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gbGF5b3V0SW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhIaWRlLnh4c11gLCBpbnB1dHM6IGhpZGVJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEhpZGVYeHNEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBoaWRlSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhTaG93Lnh4c11gLCBpbnB1dHM6IHNob3dJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFNob3dYeHNEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBzaG93SW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdDbGFzcy54eHNdYCwgaW5wdXRzOiBjbGFzc0lucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50Q2xhc3NYeHNEaXJlY3RpdmUgZXh0ZW5kcyBDbGFzc0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBjbGFzc0lucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW25nU3R5bGUueHhzXWAsIGlucHV0czogc3R5bGVJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFN0eWxlWHhzRGlyZWN0aXZlIGV4dGVuZHMgU3R5bGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc3R5bGVJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtpbWdTcmMueHhzXWAsIGlucHV0czogaW1nSW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRJbWdTcmNYeHNEaXJlY3RpdmUgZXh0ZW5kcyBJbWdTcmNEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW1nSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4Lnh4c11gLCBpbnB1dHM6IGZsZXhJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZsZXhYeHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZsZXhJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhPcmRlci54eHNdYCwgaW5wdXRzOiBvcmRlcklucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T3JkZXJYeHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T3JkZXJEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb3JkZXJJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhPZmZzZXQueHhzXWAsIGlucHV0czogb2Zmc2V0SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRPZmZzZXRYeHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T2Zmc2V0RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IG9mZnNldElucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEFsaWduLnh4c11gLCBpbnB1dHM6IGZsZXhBbGlnbklucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmxleEFsaWduWHhzRGlyZWN0aXZlIGV4dGVuZHMgRmxleEFsaWduRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZsZXhBbGlnbklucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEZpbGwueHhzXWAsIGlucHV0czogZmlsbElucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmlsbFh4c0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhGaWxsRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZpbGxJbnB1dHM7XG59XG4iXX0=