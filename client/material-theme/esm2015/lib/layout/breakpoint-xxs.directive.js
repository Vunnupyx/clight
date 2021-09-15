import { Directive } from '@angular/core';
import { ClassDirective, FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ImgSrcDirective, ShowHideDirective, StyleDirective } from "@angular/flex-layout";
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
export class BreakpointHideXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs;
    }
}
BreakpointHideXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxHide.xxs]`, inputs: hideInputs
            },] }
];
export class BreakpointShowXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs;
    }
}
BreakpointShowXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxShow.xxs]`, inputs: showInputs
            },] }
];
export class BreakpointClassXxsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs;
    }
}
BreakpointClassXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngClass.xxs]`, inputs: classInputs
            },] }
];
export class BreakpointStyleXxsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs;
    }
}
BreakpointStyleXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngStyle.xxs]`, inputs: styleInputs
            },] }
];
export class BreakpointImgSrcXxsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs;
    }
}
BreakpointImgSrcXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[imgSrc.xxs]`, inputs: imgInputs
            },] }
];
export class BreakpointFlexXxsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs;
    }
}
BreakpointFlexXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlex.xxs]`, inputs: flexInputs
            },] }
];
export class BreakpointOrderXxsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs;
    }
}
BreakpointOrderXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOrder.xxs]`, inputs: orderInputs
            },] }
];
export class BreakpointOffsetXxsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs;
    }
}
BreakpointOffsetXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOffset.xxs]`, inputs: offsetInputs
            },] }
];
export class BreakpointFlexAlignXxsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs;
    }
}
BreakpointFlexAlignXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexAlign.xxs]`, inputs: flexAlignInputs
            },] }
];
export class BreakpointFillXxsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs;
    }
}
BreakpointFillXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexFill.xxs]`, inputs: fillInputs
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC14eHMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtdGhlbWUvc3JjL2xpYi9sYXlvdXQvYnJlYWtwb2ludC14eHMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUNMLGNBQWMsRUFBRSxrQkFBa0IsRUFDbEMsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUNyRCxrQkFBa0IsRUFDbEIsZUFBZSxFQUNmLGlCQUFpQixFQUNqQixjQUFjLEVBQ2YsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixNQUFNLFVBQVUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sVUFBVSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNwQyxNQUFNLFdBQVcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sU0FBUyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxNQUFNLFdBQVcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sZUFBZSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM1QyxNQUFNLFVBQVUsR0FBRyxDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBTXBELE1BQU0sT0FBTywwQkFBMkIsU0FBUSxpQkFBaUI7SUFIakU7O1FBSVksV0FBTSxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDOzs7WUFMQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsVUFBVTthQUM3Qzs7QUFRRCxNQUFNLE9BQU8sMEJBQTJCLFNBQVEsaUJBQWlCO0lBSGpFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFVBQVU7YUFDN0M7O0FBUUQsTUFBTSxPQUFPLDJCQUE0QixTQUFRLGNBQWM7SUFIL0Q7O1FBSVksV0FBTSxHQUFHLFdBQVcsQ0FBQztJQUNqQyxDQUFDOzs7WUFMQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsV0FBVzthQUMvQzs7QUFRRCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsY0FBYztJQUgvRDs7UUFJWSxXQUFNLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxXQUFXO2FBQy9DOztBQVFELE1BQU0sT0FBTyw0QkFBNkIsU0FBUSxlQUFlO0lBSGpFOztRQUlZLFdBQU0sR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFNBQVM7YUFDNUM7O0FBUUQsTUFBTSxPQUFPLDBCQUEyQixTQUFRLGFBQWE7SUFIN0Q7O1FBSVksV0FBTSxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDOzs7WUFMQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsVUFBVTthQUM3Qzs7QUFRRCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsa0JBQWtCO0lBSG5FOztRQUlZLFdBQU0sR0FBRyxXQUFXLENBQUM7SUFDakMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsV0FBVzthQUNuRDs7QUFRRCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsbUJBQW1CO0lBSHJFOztRQUlZLFdBQU0sR0FBRyxZQUFZLENBQUM7SUFDbEMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsWUFBWTthQUNyRDs7QUFRRCxNQUFNLE9BQU8sK0JBQWdDLFNBQVEsa0JBQWtCO0lBSHZFOztRQUlZLFdBQU0sR0FBRyxlQUFlLENBQUM7SUFDckMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsZUFBZTthQUN2RDs7QUFRRCxNQUFNLE9BQU8sMEJBQTJCLFNBQVEsaUJBQWlCO0lBSGpFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsVUFBVTthQUNqRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2xhc3NEaXJlY3RpdmUsIEZsZXhBbGlnbkRpcmVjdGl2ZSxcbiAgRmxleERpcmVjdGl2ZSwgRmxleEZpbGxEaXJlY3RpdmUsIEZsZXhPZmZzZXREaXJlY3RpdmUsXG4gIEZsZXhPcmRlckRpcmVjdGl2ZSxcbiAgSW1nU3JjRGlyZWN0aXZlLFxuICBTaG93SGlkZURpcmVjdGl2ZSxcbiAgU3R5bGVEaXJlY3RpdmVcbn0gZnJvbSBcIkBhbmd1bGFyL2ZsZXgtbGF5b3V0XCI7XG5cbmNvbnN0IGhpZGVJbnB1dHMgPSBbJ2Z4SGlkZS54eHMnXTtcbmNvbnN0IHNob3dJbnB1dHMgPSBbJ2Z4U2hvdy54eHMnXTtcbmNvbnN0IGNsYXNzSW5wdXRzID0gWyduZ0NsYXNzLnh4cyddO1xuY29uc3Qgc3R5bGVJbnB1dHMgPSBbJ25nU3R5bGUueHhzJ107XG5jb25zdCBpbWdJbnB1dHMgPSBbJ2ltZ1NyYy54eHMnXTtcbmNvbnN0IGZsZXhJbnB1dHMgPSBbJ2Z4RmxleC54eHMnXTtcbmNvbnN0IG9yZGVySW5wdXRzID0gWydmeEZsZXhPcmRlci54eHMnXTtcbmNvbnN0IG9mZnNldElucHV0cyA9IFsnZnhGbGV4T2Zmc2V0Lnh4cyddO1xuY29uc3QgZmxleEFsaWduSW5wdXRzID0gWydmeEZsZXhBbGlnbi54eHMnXTtcbmNvbnN0IGZpbGxJbnB1dHMgPSBbJ2Z4RmxleEZpbGwueHhzJywgJ2Z4RmlsbC54eHMnXTtcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhIaWRlLnh4c11gLCBpbnB1dHM6IGhpZGVJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEhpZGVYeHNEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBoaWRlSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhTaG93Lnh4c11gLCBpbnB1dHM6IHNob3dJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFNob3dYeHNEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBzaG93SW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdDbGFzcy54eHNdYCwgaW5wdXRzOiBjbGFzc0lucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50Q2xhc3NYeHNEaXJlY3RpdmUgZXh0ZW5kcyBDbGFzc0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBjbGFzc0lucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW25nU3R5bGUueHhzXWAsIGlucHV0czogc3R5bGVJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludFN0eWxlWHhzRGlyZWN0aXZlIGV4dGVuZHMgU3R5bGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gc3R5bGVJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtpbWdTcmMueHhzXWAsIGlucHV0czogaW1nSW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRJbWdTcmNYeHNEaXJlY3RpdmUgZXh0ZW5kcyBJbWdTcmNEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW1nSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4Lnh4c11gLCBpbnB1dHM6IGZsZXhJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZsZXhYeHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZsZXhJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhPcmRlci54eHNdYCwgaW5wdXRzOiBvcmRlcklucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T3JkZXJYeHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T3JkZXJEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb3JkZXJJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXhPZmZzZXQueHhzXWAsIGlucHV0czogb2Zmc2V0SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRPZmZzZXRYeHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T2Zmc2V0RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IG9mZnNldElucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEFsaWduLnh4c11gLCBpbnB1dHM6IGZsZXhBbGlnbklucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmxleEFsaWduWHhzRGlyZWN0aXZlIGV4dGVuZHMgRmxleEFsaWduRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZsZXhBbGlnbklucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleEZpbGwueHhzXWAsIGlucHV0czogZmlsbElucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50RmlsbFh4c0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhGaWxsRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGZpbGxJbnB1dHM7XG59XG4iXX0=