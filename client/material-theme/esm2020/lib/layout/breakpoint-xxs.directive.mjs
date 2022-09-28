import { Directive } from '@angular/core';
import { ClassDirective, FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ImgSrcDirective, LayoutDirective, ShowHideDirective, StyleDirective } from "@angular/flex-layout";
import * as i0 from "@angular/core";
const layoutInput = ['fxLayout.xxs'];
const hideInput = ['fxHide.xxs'];
const showInput = ['fxShow.xxs'];
const classInput = ['ngClass.xxs'];
const styleInput = ['ngStyle.xxs'];
const imgInput = ['imgSrc.xxs'];
const flexInput = ['fxFlex.xxs'];
const orderInput = ['fxFlexOrder.xxs'];
const offsetInput = ['fxFlexOffset.xxs'];
const flexAlignInput = ['fxFlexAlign.xxs'];
const fillInput = ['fxFlexFill.xxs', 'fxFill.xxs'];
export class BreakpointLayoutXxsDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInput;
    }
}
BreakpointLayoutXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointLayoutXxsDirective, selector: "[fxLayout.xxs]", inputs: { "fxLayout.xxs": "fxLayout.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.xxs]`,
                    inputs: layoutInput
                }]
        }] });
export class BreakpointHideXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInput;
    }
}
BreakpointHideXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointHideXxsDirective, selector: "[fxHide.xxs]", inputs: { "fxHide.xxs": "fxHide.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.xxs]`,
                    inputs: hideInput
                }]
        }] });
export class BreakpointShowXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInput;
    }
}
BreakpointShowXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointShowXxsDirective, selector: "[fxShow.xxs]", inputs: { "fxShow.xxs": "fxShow.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.xxs]`,
                    inputs: showInput
                }]
        }] });
export class BreakpointClassXxsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInput;
    }
}
BreakpointClassXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointClassXxsDirective, selector: "[ngClass.xxs]", inputs: { "ngClass.xxs": "ngClass.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.xxs]`,
                    inputs: classInput
                }]
        }] });
export class BreakpointStyleXxsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInput;
    }
}
BreakpointStyleXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointStyleXxsDirective, selector: "[ngStyle.xxs]", inputs: { "ngStyle.xxs": "ngStyle.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.xxs]`,
                    inputs: styleInput
                }]
        }] });
export class BreakpointImgSrcXxsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInput;
    }
}
BreakpointImgSrcXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointImgSrcXxsDirective, selector: "[imgSrc.xxs]", inputs: { "imgSrc.xxs": "imgSrc.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.xxs]`,
                    inputs: imgInput
                }]
        }] });
export class BreakpointFlexXxsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInput;
    }
}
BreakpointFlexXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexXxsDirective, selector: "[fxFlex.xxs]", inputs: { "fxFlex.xxs": "fxFlex.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.xxs]`,
                    inputs: flexInput
                }]
        }] });
export class BreakpointOrderXxsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInput;
    }
}
BreakpointOrderXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOrderXxsDirective, selector: "[fxFlexOrder.xxs]", inputs: { "fxFlexOrder.xxs": "fxFlexOrder.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.xxs]`,
                    inputs: orderInput
                }]
        }] });
export class BreakpointOffsetXxsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInput;
    }
}
BreakpointOffsetXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOffsetXxsDirective, selector: "[fxFlexOffset.xxs]", inputs: { "fxFlexOffset.xxs": "fxFlexOffset.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.xxs]`,
                    inputs: offsetInput
                }]
        }] });
export class BreakpointFlexAlignXxsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInput;
    }
}
BreakpointFlexAlignXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexAlignXxsDirective, selector: "[fxFlexAlign.xxs]", inputs: { "fxFlexAlign.xxs": "fxFlexAlign.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.xxs]`,
                    inputs: flexAlignInput
                }]
        }] });
export class BreakpointFillXxsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInput;
    }
}
BreakpointFillXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFillXxsDirective, selector: "[fxFlexFill.xxs]", inputs: { "fxFlexFill.xxs": "fxFlexFill.xxs", "fxFill.xxs": "fxFill.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.xxs]`,
                    inputs: fillInput
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC14eHMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtdGhlbWUvbWF0ZXJpYWwtdGhlbWUvc3JjL2xpYi9sYXlvdXQvYnJlYWtwb2ludC14eHMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUNMLGNBQWMsRUFBRSxrQkFBa0IsRUFDbEMsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUNyRCxrQkFBa0IsRUFDbEIsZUFBZSxFQUFFLGVBQWUsRUFDaEMsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZixNQUFNLHNCQUFzQixDQUFDOztBQUU5QixNQUFNLFdBQVcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sU0FBUyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqQyxNQUFNLFVBQVUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sVUFBVSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbkMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoQyxNQUFNLFNBQVMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pDLE1BQU0sVUFBVSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2QyxNQUFNLFdBQVcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDekMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sU0FBUyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFPbkQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGVBQWU7SUFKakU7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T0FBTywwQkFBMkIsU0FBUSxpQkFBaUI7SUFKakU7O1FBS1ksV0FBTSxHQUFHLFNBQVMsQ0FBQztLQUM5Qjs7dUhBRlksMEJBQTBCOzJHQUExQiwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFKdEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixNQUFNLEVBQUUsU0FBUztpQkFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDbGFzc0RpcmVjdGl2ZSwgRmxleEFsaWduRGlyZWN0aXZlLFxuICBGbGV4RGlyZWN0aXZlLCBGbGV4RmlsbERpcmVjdGl2ZSwgRmxleE9mZnNldERpcmVjdGl2ZSxcbiAgRmxleE9yZGVyRGlyZWN0aXZlLFxuICBJbWdTcmNEaXJlY3RpdmUsIExheW91dERpcmVjdGl2ZSxcbiAgU2hvd0hpZGVEaXJlY3RpdmUsXG4gIFN0eWxlRGlyZWN0aXZlXG59IGZyb20gXCJAYW5ndWxhci9mbGV4LWxheW91dFwiO1xuXG5jb25zdCBsYXlvdXRJbnB1dCA9IFsnZnhMYXlvdXQueHhzJ107XG5jb25zdCBoaWRlSW5wdXQgPSBbJ2Z4SGlkZS54eHMnXTtcbmNvbnN0IHNob3dJbnB1dCA9IFsnZnhTaG93Lnh4cyddO1xuY29uc3QgY2xhc3NJbnB1dCA9IFsnbmdDbGFzcy54eHMnXTtcbmNvbnN0IHN0eWxlSW5wdXQgPSBbJ25nU3R5bGUueHhzJ107XG5jb25zdCBpbWdJbnB1dCA9IFsnaW1nU3JjLnh4cyddO1xuY29uc3QgZmxleElucHV0ID0gWydmeEZsZXgueHhzJ107XG5jb25zdCBvcmRlcklucHV0ID0gWydmeEZsZXhPcmRlci54eHMnXTtcbmNvbnN0IG9mZnNldElucHV0ID0gWydmeEZsZXhPZmZzZXQueHhzJ107XG5jb25zdCBmbGV4QWxpZ25JbnB1dCA9IFsnZnhGbGV4QWxpZ24ueHhzJ107XG5jb25zdCBmaWxsSW5wdXQgPSBbJ2Z4RmxleEZpbGwueHhzJywgJ2Z4RmlsbC54eHMnXTtcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhMYXlvdXQueHhzXWAsXG4gIGlucHV0czogbGF5b3V0SW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludExheW91dFh4c0RpcmVjdGl2ZSBleHRlbmRzIExheW91dERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBsYXlvdXRJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4SGlkZS54eHNdYCxcbiAgaW5wdXRzOiBoaWRlSW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEhpZGVYeHNEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBoaWRlSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeFNob3cueHhzXWAsXG4gIGlucHV0czogc2hvd0lucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRTaG93WHhzRGlyZWN0aXZlIGV4dGVuZHMgU2hvd0hpZGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc2hvd0lucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdDbGFzcy54eHNdYCxcbiAgaW5wdXRzOiBjbGFzc0lucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRDbGFzc1h4c0RpcmVjdGl2ZSBleHRlbmRzIENsYXNzRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGNsYXNzSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtuZ1N0eWxlLnh4c11gLFxuICBpbnB1dHM6IHN0eWxlSW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFN0eWxlWHhzRGlyZWN0aXZlIGV4dGVuZHMgU3R5bGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc3R5bGVJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2ltZ1NyYy54eHNdYCxcbiAgaW5wdXRzOiBpbWdJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50SW1nU3JjWHhzRGlyZWN0aXZlIGV4dGVuZHMgSW1nU3JjRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGltZ0lucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4Lnh4c11gLFxuICBpbnB1dHM6IGZsZXhJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmxleFh4c0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleElucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4T3JkZXIueHhzXWAsXG4gIGlucHV0czogb3JkZXJJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T3JkZXJYeHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T3JkZXJEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb3JkZXJJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleE9mZnNldC54eHNdYCxcbiAgaW5wdXRzOiBvZmZzZXRJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T2Zmc2V0WHhzRGlyZWN0aXZlIGV4dGVuZHMgRmxleE9mZnNldERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBvZmZzZXRJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEFsaWduLnh4c11gLFxuICBpbnB1dHM6IGZsZXhBbGlnbklucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRGbGV4QWxpZ25YeHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4QWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleEFsaWduSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhGaWxsLnh4c11gLFxuICBpbnB1dHM6IGZpbGxJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmlsbFh4c0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhGaWxsRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZpbGxJbnB1dDtcbn1cbiJdfQ==