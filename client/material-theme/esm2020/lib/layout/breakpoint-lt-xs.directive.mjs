import { Directive } from '@angular/core';
import { ClassDirective, FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ImgSrcDirective, LayoutDirective, ShowHideDirective, StyleDirective } from "@angular/flex-layout";
import * as i0 from "@angular/core";
const layoutInput = ['fxLayout.lt-xs'];
const hideInput = ['fxHide.lt-xs'];
const showInput = ['fxShow.lt-xs'];
const classInput = ['ngClass.lt-xs'];
const styleInput = ['ngStyle.lt-xs'];
const imgInput = ['imgSrc.lt-xs'];
const flexInput = ['fxFlex.lt-xs'];
const orderInput = ['fxFlexOrder.lt-xs'];
const offsetInput = ['fxFlexOffset.lt-xs'];
const flexAlignInput = ['fxFlexAlign.lt-xs'];
const fillInput = ['fxFlexFill.lt-xs', 'fxFill.lt-xs'];
export class BreakpointLayoutLtXsDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInput;
    }
}
BreakpointLayoutLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointLayoutLtXsDirective, selector: "[fxLayout.lt-xs]", inputs: { "fxLayout.lt-xs": "fxLayout.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.lt-xs]`,
                    inputs: layoutInput
                }]
        }] });
export class BreakpointHideLtXsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInput;
    }
}
BreakpointHideLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointHideLtXsDirective, selector: "[fxHide.lt-xs]", inputs: { "fxHide.lt-xs": "fxHide.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.lt-xs]`,
                    inputs: hideInput
                }]
        }] });
export class BreakpointShowLtXsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInput;
    }
}
BreakpointShowLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointShowLtXsDirective, selector: "[fxShow.lt-xs]", inputs: { "fxShow.lt-xs": "fxShow.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.lt-xs]`,
                    inputs: showInput
                }]
        }] });
export class BreakpointClassLtXsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInput;
    }
}
BreakpointClassLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointClassLtXsDirective, selector: "[ngClass.lt-xs]", inputs: { "ngClass.lt-xs": "ngClass.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.lt-xs]`,
                    inputs: classInput
                }]
        }] });
export class BreakpointStyleLtXsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInput;
    }
}
BreakpointStyleLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointStyleLtXsDirective, selector: "[ngStyle.lt-xs]", inputs: { "ngStyle.lt-xs": "ngStyle.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.lt-xs]`,
                    inputs: styleInput
                }]
        }] });
export class BreakpointImgSrcLtXsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInput;
    }
}
BreakpointImgSrcLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointImgSrcLtXsDirective, selector: "[imgSrc.lt-xs]", inputs: { "imgSrc.lt-xs": "imgSrc.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.lt-xs]`,
                    inputs: imgInput
                }]
        }] });
export class BreakpointFlexLtXsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInput;
    }
}
BreakpointFlexLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexLtXsDirective, selector: "[fxFlex.lt-xs]", inputs: { "fxFlex.lt-xs": "fxFlex.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.lt-xs]`,
                    inputs: flexInput
                }]
        }] });
export class BreakpointOrderLtXsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInput;
    }
}
BreakpointOrderLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOrderLtXsDirective, selector: "[fxFlexOrder.lt-xs]", inputs: { "fxFlexOrder.lt-xs": "fxFlexOrder.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.lt-xs]`,
                    inputs: orderInput
                }]
        }] });
export class BreakpointOffsetLtXsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInput;
    }
}
BreakpointOffsetLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOffsetLtXsDirective, selector: "[fxFlexOffset.lt-xs]", inputs: { "fxFlexOffset.lt-xs": "fxFlexOffset.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.lt-xs]`,
                    inputs: offsetInput
                }]
        }] });
export class BreakpointFlexAlignLtXsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInput;
    }
}
BreakpointFlexAlignLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexAlignLtXsDirective, selector: "[fxFlexAlign.lt-xs]", inputs: { "fxFlexAlign.lt-xs": "fxFlexAlign.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.lt-xs]`,
                    inputs: flexAlignInput
                }]
        }] });
export class BreakpointFillLtXsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInput;
    }
}
BreakpointFillLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFillLtXsDirective, selector: "[fxFlexFill.lt-xs]", inputs: { "fxFlexFill.lt-xs": "fxFlexFill.lt-xs", "fxFill.lt-xs": "fxFill.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.lt-xs]`,
                    inputs: fillInput
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC1sdC14cy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC10aGVtZS9tYXRlcmlhbC10aGVtZS9zcmMvbGliL2xheW91dC9icmVha3BvaW50LWx0LXhzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFDTCxjQUFjLEVBQUUsa0JBQWtCLEVBQ2xDLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFDckQsa0JBQWtCLEVBQ2xCLGVBQWUsRUFBRSxlQUFlLEVBQ2hDLGlCQUFpQixFQUNqQixjQUFjLEVBQ2YsTUFBTSxzQkFBc0IsQ0FBQzs7QUFFOUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3ZDLE1BQU0sU0FBUyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuQyxNQUFNLFVBQVUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sVUFBVSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNsQyxNQUFNLFNBQVMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sVUFBVSxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6QyxNQUFNLFdBQVcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDM0MsTUFBTSxjQUFjLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sU0FBUyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFPdkQsTUFBTSxPQUFPLDZCQUE4QixTQUFRLGVBQWU7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aUJBQ3ZCOztBQVNELE1BQU0sT0FBTywyQkFBNEIsU0FBUSxpQkFBaUI7SUFKbEU7O1FBS1ksV0FBTSxHQUFHLFNBQVMsQ0FBQztLQUM5Qjs7d0hBRlksMkJBQTJCOzRHQUEzQiwyQkFBMkI7MkZBQTNCLDJCQUEyQjtrQkFKdkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixNQUFNLEVBQUUsU0FBUztpQkFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDbGFzc0RpcmVjdGl2ZSwgRmxleEFsaWduRGlyZWN0aXZlLFxuICBGbGV4RGlyZWN0aXZlLCBGbGV4RmlsbERpcmVjdGl2ZSwgRmxleE9mZnNldERpcmVjdGl2ZSxcbiAgRmxleE9yZGVyRGlyZWN0aXZlLFxuICBJbWdTcmNEaXJlY3RpdmUsIExheW91dERpcmVjdGl2ZSxcbiAgU2hvd0hpZGVEaXJlY3RpdmUsXG4gIFN0eWxlRGlyZWN0aXZlXG59IGZyb20gXCJAYW5ndWxhci9mbGV4LWxheW91dFwiO1xuXG5jb25zdCBsYXlvdXRJbnB1dCA9IFsnZnhMYXlvdXQubHQteHMnXTtcbmNvbnN0IGhpZGVJbnB1dCA9IFsnZnhIaWRlLmx0LXhzJ107XG5jb25zdCBzaG93SW5wdXQgPSBbJ2Z4U2hvdy5sdC14cyddO1xuY29uc3QgY2xhc3NJbnB1dCA9IFsnbmdDbGFzcy5sdC14cyddO1xuY29uc3Qgc3R5bGVJbnB1dCA9IFsnbmdTdHlsZS5sdC14cyddO1xuY29uc3QgaW1nSW5wdXQgPSBbJ2ltZ1NyYy5sdC14cyddO1xuY29uc3QgZmxleElucHV0ID0gWydmeEZsZXgubHQteHMnXTtcbmNvbnN0IG9yZGVySW5wdXQgPSBbJ2Z4RmxleE9yZGVyLmx0LXhzJ107XG5jb25zdCBvZmZzZXRJbnB1dCA9IFsnZnhGbGV4T2Zmc2V0Lmx0LXhzJ107XG5jb25zdCBmbGV4QWxpZ25JbnB1dCA9IFsnZnhGbGV4QWxpZ24ubHQteHMnXTtcbmNvbnN0IGZpbGxJbnB1dCA9IFsnZnhGbGV4RmlsbC5sdC14cycsICdmeEZpbGwubHQteHMnXTtcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhMYXlvdXQubHQteHNdYCxcbiAgaW5wdXRzOiBsYXlvdXRJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50TGF5b3V0THRYc0RpcmVjdGl2ZSBleHRlbmRzIExheW91dERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBsYXlvdXRJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4SGlkZS5sdC14c11gLFxuICBpbnB1dHM6IGhpZGVJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50SGlkZUx0WHNEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBoaWRlSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeFNob3cubHQteHNdYCxcbiAgaW5wdXRzOiBzaG93SW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFNob3dMdFhzRGlyZWN0aXZlIGV4dGVuZHMgU2hvd0hpZGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc2hvd0lucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdDbGFzcy5sdC14c11gLFxuICBpbnB1dHM6IGNsYXNzSW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludENsYXNzTHRYc0RpcmVjdGl2ZSBleHRlbmRzIENsYXNzRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGNsYXNzSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtuZ1N0eWxlLmx0LXhzXWAsXG4gIGlucHV0czogc3R5bGVJbnB1dFxufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50U3R5bGVMdFhzRGlyZWN0aXZlIGV4dGVuZHMgU3R5bGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc3R5bGVJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2ltZ1NyYy5sdC14c11gLFxuICBpbnB1dHM6IGltZ0lucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRJbWdTcmNMdFhzRGlyZWN0aXZlIGV4dGVuZHMgSW1nU3JjRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGltZ0lucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4Lmx0LXhzXWAsXG4gIGlucHV0czogZmxleElucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRGbGV4THRYc0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleElucHV0O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4T3JkZXIubHQteHNdYCxcbiAgaW5wdXRzOiBvcmRlcklucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRPcmRlckx0WHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T3JkZXJEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb3JkZXJJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleE9mZnNldC5sdC14c11gLFxuICBpbnB1dHM6IG9mZnNldElucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRPZmZzZXRMdFhzRGlyZWN0aXZlIGV4dGVuZHMgRmxleE9mZnNldERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBvZmZzZXRJbnB1dDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEFsaWduLmx0LXhzXWAsXG4gIGlucHV0czogZmxleEFsaWduSW5wdXRcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZsZXhBbGlnbkx0WHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4QWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleEFsaWduSW5wdXQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhGaWxsLmx0LXhzXWAsXG4gIGlucHV0czogZmlsbElucHV0XG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRGaWxsTHRYc0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhGaWxsRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZpbGxJbnB1dDtcbn1cbiJdfQ==