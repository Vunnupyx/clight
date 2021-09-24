import { Directive } from '@angular/core';
import {
  ClassDirective,
  FlexAlignDirective,
  FlexDirective,
  FlexFillDirective,
  FlexOffsetDirective,
  FlexOrderDirective,
  ImgSrcDirective,
  ShowHideDirective,
  StyleDirective
} from '@angular/flex-layout';
const hideInputs = ['fxHide.lt-xs'];
const showInputs = ['fxShow.lt-xs'];
const classInputs = ['ngClass.lt-xs'];
const styleInputs = ['ngStyle.lt-xs'];
const imgInputs = ['imgSrc.lt-xs'];
const flexInputs = ['fxFlex.lt-xs'];
const orderInputs = ['fxFlexOrder.lt-xs'];
const offsetInputs = ['fxFlexOffset.lt-xs'];
const flexAlignInputs = ['fxFlexAlign.lt-xs'];
const fillInputs = ['fxFlexFill.lt-xs', 'fxFill.lt-xs'];
export class BreakpointHideLtXsDirective extends ShowHideDirective {
  constructor() {
    super(...arguments);
    this.inputs = hideInputs;
  }
}
BreakpointHideLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxHide.lt-xs]`,
        inputs: hideInputs
      }
    ]
  }
];
export class BreakpointShowLtXsDirective extends ShowHideDirective {
  constructor() {
    super(...arguments);
    this.inputs = showInputs;
  }
}
BreakpointShowLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxShow.lt-xs]`,
        inputs: showInputs
      }
    ]
  }
];
export class BreakpointClassLtXsDirective extends ClassDirective {
  constructor() {
    super(...arguments);
    this.inputs = classInputs;
  }
}
BreakpointClassLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[ngClass.lt-xs]`,
        inputs: classInputs
      }
    ]
  }
];
export class BreakpointStyleLtXsDirective extends StyleDirective {
  constructor() {
    super(...arguments);
    this.inputs = styleInputs;
  }
}
BreakpointStyleLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[ngStyle.lt-xs]`,
        inputs: styleInputs
      }
    ]
  }
];
export class BreakpointImgSrcLtXsDirective extends ImgSrcDirective {
  constructor() {
    super(...arguments);
    this.inputs = imgInputs;
  }
}
BreakpointImgSrcLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[imgSrc.lt-xs]`,
        inputs: imgInputs
      }
    ]
  }
];
export class BreakpointFlexLtXsDirective extends FlexDirective {
  constructor() {
    super(...arguments);
    this.inputs = flexInputs;
  }
}
BreakpointFlexLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlex.lt-xs]`,
        inputs: flexInputs
      }
    ]
  }
];
export class BreakpointOrderLtXsDirective extends FlexOrderDirective {
  constructor() {
    super(...arguments);
    this.inputs = orderInputs;
  }
}
BreakpointOrderLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlexOrder.lt-xs]`,
        inputs: orderInputs
      }
    ]
  }
];
export class BreakpointOffsetLtXsDirective extends FlexOffsetDirective {
  constructor() {
    super(...arguments);
    this.inputs = offsetInputs;
  }
}
BreakpointOffsetLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlexOffset.lt-xs]`,
        inputs: offsetInputs
      }
    ]
  }
];
export class BreakpointFlexAlignLtXsDirective extends FlexAlignDirective {
  constructor() {
    super(...arguments);
    this.inputs = flexAlignInputs;
  }
}
BreakpointFlexAlignLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlexAlign.lt-xs]`,
        inputs: flexAlignInputs
      }
    ]
  }
];
export class BreakpointFillLtXsDirective extends FlexFillDirective {
  constructor() {
    super(...arguments);
    this.inputs = fillInputs;
  }
}
BreakpointFillLtXsDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlexFill.lt-xs]`,
        inputs: fillInputs
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC1sdC14cy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC10aGVtZS9zcmMvbGliL2xheW91dC9icmVha3BvaW50LWx0LXhzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFDTCxjQUFjLEVBQUUsa0JBQWtCLEVBQ2xDLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFDckQsa0JBQWtCLEVBQ2xCLGVBQWUsRUFDZixpQkFBaUIsRUFDakIsY0FBYyxFQUNmLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxNQUFNLFVBQVUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sV0FBVyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxNQUFNLFNBQVMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sVUFBVSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sWUFBWSxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM1QyxNQUFNLGVBQWUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDOUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztBQU14RCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsaUJBQWlCO0lBSGxFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsVUFBVTthQUMvQzs7QUFRRCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsaUJBQWlCO0lBSGxFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsVUFBVTthQUMvQzs7QUFRRCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsY0FBYztJQUhoRTs7UUFJWSxXQUFNLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLFdBQVc7YUFDakQ7O0FBUUQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGNBQWM7SUFIaEU7O1FBSVksV0FBTSxHQUFHLFdBQVcsQ0FBQztJQUNqQyxDQUFDOzs7WUFMQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxXQUFXO2FBQ2pEOztBQVFELE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxlQUFlO0lBSGxFOztRQUlZLFdBQU0sR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsU0FBUzthQUM5Qzs7QUFRRCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsYUFBYTtJQUg5RDs7UUFJWSxXQUFNLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLFVBQVU7YUFDL0M7O0FBUUQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGtCQUFrQjtJQUhwRTs7UUFJWSxXQUFNLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLFdBQVc7YUFDckQ7O0FBUUQsTUFBTSxPQUFPLDZCQUE4QixTQUFRLG1CQUFtQjtJQUh0RTs7UUFJWSxXQUFNLEdBQUcsWUFBWSxDQUFDO0lBQ2xDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxFQUFFLFlBQVk7YUFDdkQ7O0FBUUQsTUFBTSxPQUFPLGdDQUFpQyxTQUFRLGtCQUFrQjtJQUh4RTs7UUFJWSxXQUFNLEdBQUcsZUFBZSxDQUFDO0lBQ3JDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLGVBQWU7YUFDekQ7O0FBUUQsTUFBTSxPQUFPLDJCQUE0QixTQUFRLGlCQUFpQjtJQUhsRTs7UUFJWSxXQUFNLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLFVBQVU7YUFDbkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENsYXNzRGlyZWN0aXZlLCBGbGV4QWxpZ25EaXJlY3RpdmUsXG4gIEZsZXhEaXJlY3RpdmUsIEZsZXhGaWxsRGlyZWN0aXZlLCBGbGV4T2Zmc2V0RGlyZWN0aXZlLFxuICBGbGV4T3JkZXJEaXJlY3RpdmUsXG4gIEltZ1NyY0RpcmVjdGl2ZSxcbiAgU2hvd0hpZGVEaXJlY3RpdmUsXG4gIFN0eWxlRGlyZWN0aXZlXG59IGZyb20gXCJAYW5ndWxhci9mbGV4LWxheW91dFwiO1xuXG5jb25zdCBoaWRlSW5wdXRzID0gWydmeEhpZGUubHQteHMnXTtcbmNvbnN0IHNob3dJbnB1dHMgPSBbJ2Z4U2hvdy5sdC14cyddO1xuY29uc3QgY2xhc3NJbnB1dHMgPSBbJ25nQ2xhc3MubHQteHMnXTtcbmNvbnN0IHN0eWxlSW5wdXRzID0gWyduZ1N0eWxlLmx0LXhzJ107XG5jb25zdCBpbWdJbnB1dHMgPSBbJ2ltZ1NyYy5sdC14cyddO1xuY29uc3QgZmxleElucHV0cyA9IFsnZnhGbGV4Lmx0LXhzJ107XG5jb25zdCBvcmRlcklucHV0cyA9IFsnZnhGbGV4T3JkZXIubHQteHMnXTtcbmNvbnN0IG9mZnNldElucHV0cyA9IFsnZnhGbGV4T2Zmc2V0Lmx0LXhzJ107XG5jb25zdCBmbGV4QWxpZ25JbnB1dHMgPSBbJ2Z4RmxleEFsaWduLmx0LXhzJ107XG5jb25zdCBmaWxsSW5wdXRzID0gWydmeEZsZXhGaWxsLmx0LXhzJywgJ2Z4RmlsbC5sdC14cyddO1xuXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEhpZGUubHQteHNdYCwgaW5wdXRzOiBoaWRlSW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRIaWRlTHRYc0RpcmVjdGl2ZSBleHRlbmRzIFNob3dIaWRlRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGhpZGVJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeFNob3cubHQteHNdYCwgaW5wdXRzOiBzaG93SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRTaG93THRYc0RpcmVjdGl2ZSBleHRlbmRzIFNob3dIaWRlRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IHNob3dJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtuZ0NsYXNzLmx0LXhzXWAsIGlucHV0czogY2xhc3NJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludENsYXNzTHRYc0RpcmVjdGl2ZSBleHRlbmRzIENsYXNzRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGNsYXNzSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdTdHlsZS5sdC14c11gLCBpbnB1dHM6IHN0eWxlSW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRTdHlsZUx0WHNEaXJlY3RpdmUgZXh0ZW5kcyBTdHlsZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBzdHlsZUlucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2ltZ1NyYy5sdC14c11gLCBpbnB1dHM6IGltZ0lucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50SW1nU3JjTHRYc0RpcmVjdGl2ZSBleHRlbmRzIEltZ1NyY0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBpbWdJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXgubHQteHNdYCwgaW5wdXRzOiBmbGV4SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRGbGV4THRYc0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleElucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleE9yZGVyLmx0LXhzXWAsIGlucHV0czogb3JkZXJJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludE9yZGVyTHRYc0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhPcmRlckRpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBvcmRlcklucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleE9mZnNldC5sdC14c11gLCBpbnB1dHM6IG9mZnNldElucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T2Zmc2V0THRYc0RpcmVjdGl2ZSBleHRlbmRzIEZsZXhPZmZzZXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb2Zmc2V0SW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4QWxpZ24ubHQteHNdYCwgaW5wdXRzOiBmbGV4QWxpZ25JbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZsZXhBbGlnbkx0WHNEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4QWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleEFsaWduSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4RmlsbC5sdC14c11gLCBpbnB1dHM6IGZpbGxJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZpbGxMdFhzRGlyZWN0aXZlIGV4dGVuZHMgRmxleEZpbGxEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmlsbElucHV0cztcbn1cbiJdfQ==
