import { Directive } from '@angular/core';
import { ClassDirective, FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ImgSrcDirective, LayoutDirective, ShowHideDirective, StyleDirective } from "@angular/flex-layout";
import * as i0 from "@angular/core";
const layoutInput = ['fxLayout.gt-xl'];
const hideInput = ['fxHide.gt-xl'];
const showInput = ['fxShow.gt-xl'];
const classInput = ['ngClass.gt-xl'];
const styleInput = ['ngStyle.gt-xl'];
const imgInput = ['imgSrc.gt-xl'];
const flexInput = ['fxFlex.gt-xl'];
const orderInput = ['fxFlexOrder.gt-xl'];
const offsetInput = ['fxFlexOffset.gt-xl'];
const flexAlignInput = ['fxFlexAlign.gt-xl'];
const fillInput = ['fxFlexFill.gt-xl', 'fxFill.gt-xl'];
export class BreakpointLayoutGtXlDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInput;
    }
}
BreakpointLayoutGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointLayoutGtXlDirective, selector: "[fxLayout.gt-xl]", inputs: { "fxLayout.gt-xl": "fxLayout.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.gt-xl]`,
                    inputs: layoutInput
                }]
        }] });
export class BreakpointHideGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInput;
    }
}
BreakpointHideGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointHideGtXlDirective, selector: "[fxHide.gt-xl]", inputs: { "fxHide.gt-xl": "fxHide.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.gt-xl]`,
                    inputs: hideInput
                }]
        }] });
export class BreakpointShowGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInput;
    }
}
BreakpointShowGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointShowGtXlDirective, selector: "[fxShow.gt-xl]", inputs: { "fxShow.gt-xl": "fxShow.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.gt-xl]`,
                    inputs: showInput
                }]
        }] });
export class BreakpointClassGtXlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInput;
    }
}
BreakpointClassGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointClassGtXlDirective, selector: "[ngClass.gt-xl]", inputs: { "ngClass.gt-xl": "ngClass.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.gt-xl]`,
                    inputs: classInput
                }]
        }] });
export class BreakpointStyleGtXlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInput;
    }
}
BreakpointStyleGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointStyleGtXlDirective, selector: "[ngStyle.gt-xl]", inputs: { "ngStyle.gt-xl": "ngStyle.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.gt-xl]`,
                    inputs: styleInput
                }]
        }] });
export class BreakpointImgSrcGtXlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInput;
    }
}
BreakpointImgSrcGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointImgSrcGtXlDirective, selector: "[imgSrc.gt-xl]", inputs: { "imgSrc.gt-xl": "imgSrc.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.gt-xl]`,
                    inputs: imgInput
                }]
        }] });
export class BreakpointFlexGtXlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInput;
    }
}
BreakpointFlexGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexGtXlDirective, selector: "[fxFlex.gt-xl]", inputs: { "fxFlex.gt-xl": "fxFlex.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.gt-xl]`,
                    inputs: flexInput
                }]
        }] });
export class BreakpointOrderGtXlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInput;
    }
}
BreakpointOrderGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOrderGtXlDirective, selector: "[fxFlexOrder.gt-xl]", inputs: { "fxFlexOrder.gt-xl": "fxFlexOrder.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.gt-xl]`,
                    inputs: orderInput
                }]
        }] });
export class BreakpointOffsetGtXlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInput;
    }
}
BreakpointOffsetGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOffsetGtXlDirective, selector: "[fxFlexOffset.gt-xl]", inputs: { "fxFlexOffset.gt-xl": "fxFlexOffset.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.gt-xl]`,
                    inputs: offsetInput
                }]
        }] });
export class BreakpointFlexAlignGtXlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInput;
    }
}
BreakpointFlexAlignGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexAlignGtXlDirective, selector: "[fxFlexAlign.gt-xl]", inputs: { "fxFlexAlign.gt-xl": "fxFlexAlign.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.gt-xl]`,
                    inputs: flexAlignInput
                }]
        }] });
export class BreakpointFillGtXlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInput;
    }
}
BreakpointFillGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFillGtXlDirective, selector: "[fxFlexFill.gt-xl]", inputs: { "fxFlexFill.gt-xl": "fxFlexFill.gt-xl", "fxFill.gt-xl": "fxFill.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.gt-xl]`,
                    inputs: fillInput
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC1ndC14bC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC10aGVtZS9tYXRlcmlhbC10aGVtZS9zcmMvbGliL2xheW91dC9icmVha3BvaW50LWd0LXhsLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFDTCxjQUFjLEVBQUUsa0JBQWtCLEVBQ2xDLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFDckQsa0JBQWtCLEVBQ2xCLGVBQWUsRUFBRSxlQUFlLEVBQ2hDLGlCQUFpQixFQUNqQixjQUFjLEVBQ2YsTUFBTSxzQkFBc0IsQ0FBQzs7QUFFOUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3ZDLE1BQU0sU0FBUyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuQyxNQUFNLFVBQVUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sVUFBVSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNsQyxNQUFNLFNBQVMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sVUFBVSxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6QyxNQUFNLFdBQVcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDM0MsTUFBTSxjQUFjLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sU0FBUyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFNdkQsTUFBTSxPQUFPLDZCQUE4QixTQUFRLGVBQWU7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aUJBQ3ZCOztBQVNELE1BQU0sT0FBTywyQkFBNEIsU0FBUSxpQkFBaUI7SUFKbEU7O1FBS1ksV0FBTSxHQUFHLFNBQVMsQ0FBQztLQUM5Qjs7d0hBRlksMkJBQTJCOzRHQUEzQiwyQkFBMkI7MkZBQTNCLDJCQUEyQjtrQkFKdkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixNQUFNLEVBQUUsU0FBUztpQkFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDbGFzc0RpcmVjdGl2ZSwgRmxleEFsaWduRGlyZWN0aXZlLFxuICBGbGV4RGlyZWN0aXZlLCBGbGV4RmlsbERpcmVjdGl2ZSwgRmxleE9mZnNldERpcmVjdGl2ZSxcbiAgRmxleE9yZGVyRGlyZWN0aXZlLFxuICBJbWdTcmNEaXJlY3RpdmUsIExheW91dERpcmVjdGl2ZSxcbiAgU2hvd0hpZGVEaXJlY3RpdmUsXG4gIFN0eWxlRGlyZWN0aXZlXG59IGZyb20gXCJAYW5ndWxhci9mbGV4LWxheW91dFwiO1xuXG5jb25zdCBsYXlvdXRJbnB1dCA9IFsnZnhMYXlvdXQuZ3QteGwnXTtcbmNvbnN0IGhpZGVJbnB1dCA9IFsnZnhIaWRlLmd0LXhsJ107XG5jb25zdCBzaG93SW5wdXQgPSBbJ2Z4U2hvdy5ndC14bCddO1xuY29uc3QgY2xhc3NJbnB1dCA9IFsnbmdDbGFzcy5ndC14bCddO1xuY29uc3Qgc3R5bGVJbnB1dCA9IFsnbmdTdHlsZS5ndC14bCddO1xuY29uc3QgaW1nSW5wdXQgPSBbJ2ltZ1NyYy5ndC14bCddO1xuY29uc3QgZmxleElucHV0ID0gWydmeEZsZXguZ3QteGwnXTtcbmNvbnN0IG9yZGVySW5wdXQgPSBbJ2Z4RmxleE9yZGVyLmd0LXhsJ107XG5jb25zdCBvZmZzZXRJbnB1dCA9IFsnZnhGbGV4T2Zmc2V0Lmd0LXhsJ107XG5jb25zdCBmbGV4QWxpZ25JbnB1dCA9IFsnZnhGbGV4QWxpZ24uZ3QteGwnXTtcbmNvbnN0IGZpbGxJbnB1dCA9IFsnZnhGbGV4RmlsbC5ndC14bCcsICdmeEZpbGwuZ3QteGwnXTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4TGF5b3V0Lmd0LXhsXWAsXG4gIGlucHV0czogbGF5b3V0SW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludExheW91dEd0WGxEaXJlY3RpdmUgZXh0ZW5kcyBMYXlvdXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gbGF5b3V0SW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEhpZGUuZ3QteGxdYCxcbiAgaW5wdXRzOiBoaWRlSW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEhpZGVHdFhsRGlyZWN0aXZlIGV4dGVuZHMgU2hvd0hpZGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaGlkZUlucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhTaG93Lmd0LXhsXWAsXG4gIGlucHV0czogc2hvd0lucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRTaG93R3RYbERpcmVjdGl2ZSBleHRlbmRzIFNob3dIaWRlRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IHNob3dJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW25nQ2xhc3MuZ3QteGxdYCxcbiAgaW5wdXRzOiBjbGFzc0lucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRDbGFzc0d0WGxEaXJlY3RpdmUgZXh0ZW5kcyBDbGFzc0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBjbGFzc0lucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdTdHlsZS5ndC14bF1gLFxuICBpbnB1dHM6IHN0eWxlSW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFN0eWxlR3RYbERpcmVjdGl2ZSBleHRlbmRzIFN0eWxlRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IHN0eWxlSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtpbWdTcmMuZ3QteGxdYCxcbiAgaW5wdXRzOiBpbWdJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50SW1nU3JjR3RYbERpcmVjdGl2ZSBleHRlbmRzIEltZ1NyY0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBpbWdJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleC5ndC14bF1gLFxuICBpbnB1dHM6IGZsZXhJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmxleEd0WGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZsZXhJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleE9yZGVyLmd0LXhsXWAsXG4gIGlucHV0czogb3JkZXJJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T3JkZXJHdFhsRGlyZWN0aXZlIGV4dGVuZHMgRmxleE9yZGVyRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IG9yZGVySW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhPZmZzZXQuZ3QteGxdYCxcbiAgaW5wdXRzOiBvZmZzZXRJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T2Zmc2V0R3RYbERpcmVjdGl2ZSBleHRlbmRzIEZsZXhPZmZzZXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb2Zmc2V0SW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhBbGlnbi5ndC14bF1gLFxuICBpbnB1dHM6IGZsZXhBbGlnbklucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRGbGV4QWxpZ25HdFhsRGlyZWN0aXZlIGV4dGVuZHMgRmxleEFsaWduRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZsZXhBbGlnbklucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4RmlsbC5ndC14bF1gLFxuICBpbnB1dHM6IGZpbGxJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmlsbEd0WGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4RmlsbERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBmaWxsSW5wdXQ7XG59XG4iXX0=