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
export class BreakpointHideGtXlDirective extends ShowHideDirective {
  constructor() {
    super(...arguments);
    this.inputs = hideInputs;
  }
}
BreakpointHideGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxHide.gt-xl]`,
        inputs: hideInputs
      }
    ]
  }
];
export class BreakpointShowGtXlDirective extends ShowHideDirective {
  constructor() {
    super(...arguments);
    this.inputs = showInputs;
  }
}
BreakpointShowGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxShow.gt-xl]`,
        inputs: showInputs
      }
    ]
  }
];
export class BreakpointClassGtXlDirective extends ClassDirective {
  constructor() {
    super(...arguments);
    this.inputs = classInputs;
  }
}
BreakpointClassGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[ngClass.gt-xl]`,
        inputs: classInputs
      }
    ]
  }
];
export class BreakpointStyleGtXlDirective extends StyleDirective {
  constructor() {
    super(...arguments);
    this.inputs = styleInputs;
  }
}
BreakpointStyleGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[ngStyle.gt-xl]`,
        inputs: styleInputs
      }
    ]
  }
];
export class BreakpointImgSrcGtXlDirective extends ImgSrcDirective {
  constructor() {
    super(...arguments);
    this.inputs = imgInputs;
  }
}
BreakpointImgSrcGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[imgSrc.gt-xl]`,
        inputs: imgInputs
      }
    ]
  }
];
export class BreakpointFlexGtXlDirective extends FlexDirective {
  constructor() {
    super(...arguments);
    this.inputs = flexInputs;
  }
}
BreakpointFlexGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlex.gt-xl]`,
        inputs: flexInputs
      }
    ]
  }
];
export class BreakpointOrderGtXlDirective extends FlexOrderDirective {
  constructor() {
    super(...arguments);
    this.inputs = orderInputs;
  }
}
BreakpointOrderGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlexOrder.gt-xl]`,
        inputs: orderInputs
      }
    ]
  }
];
export class BreakpointOffsetGtXlDirective extends FlexOffsetDirective {
  constructor() {
    super(...arguments);
    this.inputs = offsetInputs;
  }
}
BreakpointOffsetGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlexOffset.gt-xl]`,
        inputs: offsetInputs
      }
    ]
  }
];
export class BreakpointFlexAlignGtXlDirective extends FlexAlignDirective {
  constructor() {
    super(...arguments);
    this.inputs = flexAlignInputs;
  }
}
BreakpointFlexAlignGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlexAlign.gt-xl]`,
        inputs: flexAlignInputs
      }
    ]
  }
];
export class BreakpointFillGtXlDirective extends FlexFillDirective {
  constructor() {
    super(...arguments);
    this.inputs = fillInputs;
  }
}
BreakpointFillGtXlDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: `[fxFlexFill.gt-xl]`,
        inputs: fillInputs
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC1ndC14bC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC10aGVtZS9zcmMvbGliL2xheW91dC9icmVha3BvaW50LWd0LXhsLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFDTCxjQUFjLEVBQUUsa0JBQWtCLEVBQ2xDLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFDckQsa0JBQWtCLEVBQ2xCLGVBQWUsRUFDZixpQkFBaUIsRUFDakIsY0FBYyxFQUNmLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxNQUFNLFVBQVUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sV0FBVyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxNQUFNLFNBQVMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sVUFBVSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sWUFBWSxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM1QyxNQUFNLGVBQWUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDOUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztBQU14RCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsaUJBQWlCO0lBSGxFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsVUFBVTthQUMvQzs7QUFRRCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsaUJBQWlCO0lBSGxFOztRQUlZLFdBQU0sR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsVUFBVTthQUMvQzs7QUFRRCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsY0FBYztJQUhoRTs7UUFJWSxXQUFNLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLFdBQVc7YUFDakQ7O0FBUUQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGNBQWM7SUFIaEU7O1FBSVksV0FBTSxHQUFHLFdBQVcsQ0FBQztJQUNqQyxDQUFDOzs7WUFMQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxXQUFXO2FBQ2pEOztBQVFELE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxlQUFlO0lBSGxFOztRQUlZLFdBQU0sR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsU0FBUzthQUM5Qzs7QUFRRCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsYUFBYTtJQUg5RDs7UUFJWSxXQUFNLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLFVBQVU7YUFDL0M7O0FBUUQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGtCQUFrQjtJQUhwRTs7UUFJWSxXQUFNLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLFdBQVc7YUFDckQ7O0FBUUQsTUFBTSxPQUFPLDZCQUE4QixTQUFRLG1CQUFtQjtJQUh0RTs7UUFJWSxXQUFNLEdBQUcsWUFBWSxDQUFDO0lBQ2xDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxFQUFFLFlBQVk7YUFDdkQ7O0FBUUQsTUFBTSxPQUFPLGdDQUFpQyxTQUFRLGtCQUFrQjtJQUh4RTs7UUFJWSxXQUFNLEdBQUcsZUFBZSxDQUFDO0lBQ3JDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLGVBQWU7YUFDekQ7O0FBUUQsTUFBTSxPQUFPLDJCQUE0QixTQUFRLGlCQUFpQjtJQUhsRTs7UUFJWSxXQUFNLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7OztZQUxBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLFVBQVU7YUFDbkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENsYXNzRGlyZWN0aXZlLCBGbGV4QWxpZ25EaXJlY3RpdmUsXG4gIEZsZXhEaXJlY3RpdmUsIEZsZXhGaWxsRGlyZWN0aXZlLCBGbGV4T2Zmc2V0RGlyZWN0aXZlLFxuICBGbGV4T3JkZXJEaXJlY3RpdmUsXG4gIEltZ1NyY0RpcmVjdGl2ZSxcbiAgU2hvd0hpZGVEaXJlY3RpdmUsXG4gIFN0eWxlRGlyZWN0aXZlXG59IGZyb20gXCJAYW5ndWxhci9mbGV4LWxheW91dFwiO1xuXG5jb25zdCBoaWRlSW5wdXRzID0gWydmeEhpZGUuZ3QteGwnXTtcbmNvbnN0IHNob3dJbnB1dHMgPSBbJ2Z4U2hvdy5ndC14bCddO1xuY29uc3QgY2xhc3NJbnB1dHMgPSBbJ25nQ2xhc3MuZ3QteGwnXTtcbmNvbnN0IHN0eWxlSW5wdXRzID0gWyduZ1N0eWxlLmd0LXhsJ107XG5jb25zdCBpbWdJbnB1dHMgPSBbJ2ltZ1NyYy5ndC14bCddO1xuY29uc3QgZmxleElucHV0cyA9IFsnZnhGbGV4Lmd0LXhsJ107XG5jb25zdCBvcmRlcklucHV0cyA9IFsnZnhGbGV4T3JkZXIuZ3QteGwnXTtcbmNvbnN0IG9mZnNldElucHV0cyA9IFsnZnhGbGV4T2Zmc2V0Lmd0LXhsJ107XG5jb25zdCBmbGV4QWxpZ25JbnB1dHMgPSBbJ2Z4RmxleEFsaWduLmd0LXhsJ107XG5jb25zdCBmaWxsSW5wdXRzID0gWydmeEZsZXhGaWxsLmd0LXhsJywgJ2Z4RmlsbC5ndC14bCddO1xuXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEhpZGUuZ3QteGxdYCwgaW5wdXRzOiBoaWRlSW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRIaWRlR3RYbERpcmVjdGl2ZSBleHRlbmRzIFNob3dIaWRlRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGhpZGVJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeFNob3cuZ3QteGxdYCwgaW5wdXRzOiBzaG93SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRTaG93R3RYbERpcmVjdGl2ZSBleHRlbmRzIFNob3dIaWRlRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IHNob3dJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtuZ0NsYXNzLmd0LXhsXWAsIGlucHV0czogY2xhc3NJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludENsYXNzR3RYbERpcmVjdGl2ZSBleHRlbmRzIENsYXNzRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGNsYXNzSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbmdTdHlsZS5ndC14bF1gLCBpbnB1dHM6IHN0eWxlSW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRTdHlsZUd0WGxEaXJlY3RpdmUgZXh0ZW5kcyBTdHlsZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBzdHlsZUlucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2ltZ1NyYy5ndC14bF1gLCBpbnB1dHM6IGltZ0lucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50SW1nU3JjR3RYbERpcmVjdGl2ZSBleHRlbmRzIEltZ1NyY0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBpbWdJbnB1dHM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFtmeEZsZXguZ3QteGxdYCwgaW5wdXRzOiBmbGV4SW5wdXRzXG59KVxuZXhwb3J0IGNsYXNzIEJyZWFrcG9pbnRGbGV4R3RYbERpcmVjdGl2ZSBleHRlbmRzIEZsZXhEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleElucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleE9yZGVyLmd0LXhsXWAsIGlucHV0czogb3JkZXJJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludE9yZGVyR3RYbERpcmVjdGl2ZSBleHRlbmRzIEZsZXhPcmRlckRpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBvcmRlcklucHV0cztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW2Z4RmxleE9mZnNldC5ndC14bF1gLCBpbnB1dHM6IG9mZnNldElucHV0c1xufSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50T2Zmc2V0R3RYbERpcmVjdGl2ZSBleHRlbmRzIEZsZXhPZmZzZXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gb2Zmc2V0SW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4QWxpZ24uZ3QteGxdYCwgaW5wdXRzOiBmbGV4QWxpZ25JbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZsZXhBbGlnbkd0WGxEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4QWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmxleEFsaWduSW5wdXRzO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbZnhGbGV4RmlsbC5ndC14bF1gLCBpbnB1dHM6IGZpbGxJbnB1dHNcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEZpbGxHdFhsRGlyZWN0aXZlIGV4dGVuZHMgRmxleEZpbGxEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gZmlsbElucHV0cztcbn1cbiJdfQ==
