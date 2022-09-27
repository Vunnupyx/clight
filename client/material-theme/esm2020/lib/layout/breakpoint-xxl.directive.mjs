import { Directive } from '@angular/core';
import { ClassDirective, FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ImgSrcDirective, LayoutDirective, ShowHideDirective, StyleDirective } from "@angular/flex-layout";
import * as i0 from "@angular/core";
const layoutInput = ['fxLayout.xxl'];
const hideInput = ['fxHide.xxl'];
const showInput = ['fxShow.xxl'];
const classInput = ['ngClass.xxl'];
const styleInput = ['ngStyle.xxl'];
const imgInput = ['imgSrc.xxl'];
const flexInput = ['fxFlex.xxl'];
const orderInput = ['fxFlexOrder.xxl'];
const offsetInput = ['fxFlexOffset.xxl'];
const flexAlignInput = ['fxFlexAlign.xxl'];
const fillInput = ['fxFlexFill.xxl', 'fxFill.xxl'];
export class BreakpointLayoutXxlDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInput;
    }
}
BreakpointLayoutXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointLayoutXxlDirective, selector: "[fxLayout.xxl]", inputs: { "fxLayout.xxl": "fxLayout.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.xxl]`,
                    inputs: layoutInput
                }]
        }] });
export class BreakpointHideXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInput;
    }
}
BreakpointHideXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointHideXxlDirective, selector: "[fxHide.xxl]", inputs: { "fxHide.xxl": "fxHide.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.xxl]`,
                    inputs: hideInput
                }]
        }] });
export class BreakpointShowXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInput;
    }
}
BreakpointShowXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointShowXxlDirective, selector: "[fxShow.xxl]", inputs: { "fxShow.xxl": "fxShow.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.xxl]`,
                    inputs: showInput
                }]
        }] });
export class BreakpointClassXxlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInput;
    }
}
BreakpointClassXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointClassXxlDirective, selector: "[ngClass.xxl]", inputs: { "ngClass.xxl": "ngClass.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.xxl]`,
                    inputs: classInput
                }]
        }] });
export class BreakpointStyleXxlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInput;
    }
}
BreakpointStyleXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointStyleXxlDirective, selector: "[ngStyle.xxl]", inputs: { "ngStyle.xxl": "ngStyle.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.xxl]`,
                    inputs: styleInput
                }]
        }] });
export class BreakpointImgSrcXxlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInput;
    }
}
BreakpointImgSrcXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointImgSrcXxlDirective, selector: "[imgSrc.xxl]", inputs: { "imgSrc.xxl": "imgSrc.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.xxl]`,
                    inputs: imgInput
                }]
        }] });
export class BreakpointFlexXxlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInput;
    }
}
BreakpointFlexXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexXxlDirective, selector: "[fxFlex.xxl]", inputs: { "fxFlex.xxl": "fxFlex.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.xxl]`,
                    inputs: flexInput
                }]
        }] });
export class BreakpointOrderXxlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInput;
    }
}
BreakpointOrderXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOrderXxlDirective, selector: "[fxFlexOrder.xxl]", inputs: { "fxFlexOrder.xxl": "fxFlexOrder.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.xxl]`,
                    inputs: orderInput
                }]
        }] });
export class BreakpointOffsetXxlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInput;
    }
}
BreakpointOffsetXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOffsetXxlDirective, selector: "[fxFlexOffset.xxl]", inputs: { "fxFlexOffset.xxl": "fxFlexOffset.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.xxl]`,
                    inputs: offsetInput
                }]
        }] });
export class BreakpointFlexAlignXxlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInput;
    }
}
BreakpointFlexAlignXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexAlignXxlDirective, selector: "[fxFlexAlign.xxl]", inputs: { "fxFlexAlign.xxl": "fxFlexAlign.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.xxl]`,
                    inputs: flexAlignInput
                }]
        }] });
export class BreakpointFillXxlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInput;
    }
}
BreakpointFillXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFillXxlDirective, selector: "[fxFlexFill.xxl]", inputs: { "fxFlexFill.xxl": "fxFlexFill.xxl", "fxFill.xxl": "fxFill.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.xxl]`,
                    inputs: fillInput
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC14eGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtdGhlbWUvbWF0ZXJpYWwtdGhlbWUvc3JjL2xpYi9sYXlvdXQvYnJlYWtwb2ludC14eGwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUNMLGNBQWMsRUFBRSxrQkFBa0IsRUFDbEMsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUNyRCxrQkFBa0IsRUFDbEIsZUFBZSxFQUFFLGVBQWUsRUFDaEMsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZixNQUFNLHNCQUFzQixDQUFDOztBQUU5QixNQUFNLFdBQVcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sU0FBUyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqQyxNQUFNLFVBQVUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sVUFBVSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbkMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoQyxNQUFNLFNBQVMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pDLE1BQU0sVUFBVSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2QyxNQUFNLFdBQVcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDekMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sU0FBUyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFPbkQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGVBQWU7SUFKakU7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T0FBTywwQkFBMkIsU0FBUSxpQkFBaUI7SUFKakU7O1FBS1ksV0FBTSxHQUFHLFNBQVMsQ0FBQztLQUM5Qjs7dUhBRlksMEJBQTBCOzJHQUExQiwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFKdEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixNQUFNLEVBQUUsU0FBUztpQkFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDbGFzc0RpcmVjdGl2ZSwgRmxleEFsaWduRGlyZWN0aXZlLFxuICBGbGV4RGlyZWN0aXZlLCBGbGV4RmlsbERpcmVjdGl2ZSwgRmxleE9mZnNldERpcmVjdGl2ZSxcbiAgRmxleE9yZGVyRGlyZWN0aXZlLFxuICBJbWdTcmNEaXJlY3RpdmUsIExheW91dERpcmVjdGl2ZSxcbiAgU2hvd0hpZGVEaXJlY3RpdmUsXG4gIFN0eWxlRGlyZWN0aXZlXG59IGZyb20gXCJAYW5ndWxhci9mbGV4LWxheW91dFwiO1xuXG5jb25zdCBsYXlvdXRJbnB1dCA9IFsnZnhMYXlvdXQueHhsJ107XG5jb25zdCBoaWRlSW5wdXQgPSBbJ2Z4SGlkZS54eGwnXTtcbmNvbnN0IHNob3dJbnB1dCA9IFsnZnhTaG93Lnh4bCddO1xuY29uc3QgY2xhc3NJbnB1dCA9IFsnbmdDbGFzcy54eGwnXTtcbmNvbnN0IHN0eWxlSW5wdXQgPSBbJ25nU3R5bGUueHhsJ107XG5jb25zdCBpbWdJbnB1dCA9IFsnaW1nU3JjLnh4bCddO1xuY29uc3QgZmxleElucHV0ID0gWydmeEZsZXgueHhsJ107XG5jb25zdCBvcmRlcklucHV0ID0gWydmeEZsZXhPcmRlci54eGwnXTtcbmNvbnN0IG9mZnNldElucHV0ID0gWydmeEZsZXhPZmZzZXQueHhsJ107XG5jb25zdCBmbGV4QWxpZ25JbnB1dCA9IFsnZnhGbGV4QWxpZ24ueHhsJ107XG5jb25zdCBmaWxsSW5wdXQgPSBbJ2Z4RmxleEZpbGwueHhsJywgJ2Z4RmlsbC54eGwnXTtcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhMYXlvdXQueHhsXWAsXG4gIGlucHV0czogbGF5b3V0SW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludExheW91dFh4bERpcmVjdGl2ZSBleHRlbmRzIExheW91dERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBsYXlvdXRJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4SGlkZS54eGxdYCxcbiAgaW5wdXRzOiBoaWRlSW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEhpZGVYeGxEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBoaWRlSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeFNob3cueHhsXWAsXG4gIGlucHV0czogc2hvd0lucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRTaG93WHhsRGlyZWN0aXZlIGV4dGVuZHMgU2hvd0hpZGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc2hvd0lucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdDbGFzcy54eGxdYCxcbiAgaW5wdXRzOiBjbGFzc0lucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRDbGFzc1h4bERpcmVjdGl2ZSBleHRlbmRzIENsYXNzRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGNsYXNzSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtuZ1N0eWxlLnh4bF1gLFxuICBpbnB1dHM6IHN0eWxlSW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFN0eWxlWHhsRGlyZWN0aXZlIGV4dGVuZHMgU3R5bGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc3R5bGVJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2ltZ1NyYy54eGxdYCxcbiAgaW5wdXRzOiBpbWdJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50SW1nU3JjWHhsRGlyZWN0aXZlIGV4dGVuZHMgSW1nU3JjRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGltZ0lucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4Lnh4bF1gLFxuICBpbnB1dHM6IGZsZXhJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmxleFh4bERpcmVjdGl2ZSBleHRlbmRzIEZsZXhEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleElucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4T3JkZXIueHhsXWAsXG4gIGlucHV0czogb3JkZXJJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T3JkZXJYeGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T3JkZXJEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb3JkZXJJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleE9mZnNldC54eGxdYCxcbiAgaW5wdXRzOiBvZmZzZXRJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T2Zmc2V0WHhsRGlyZWN0aXZlIGV4dGVuZHMgRmxleE9mZnNldERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBvZmZzZXRJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEFsaWduLnh4bF1gLFxuICBpbnB1dHM6IGZsZXhBbGlnbklucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRGbGV4QWxpZ25YeGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4QWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleEFsaWduSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhGaWxsLnh4bF1gLFxuICBpbnB1dHM6IGZpbGxJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmlsbFh4bERpcmVjdGl2ZSBleHRlbmRzIEZsZXhGaWxsRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZpbGxJbnB1dDtcbn1cbiJdfQ==