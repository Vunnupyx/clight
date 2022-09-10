import { APP_INITIALIZER, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export function setHoverClass() {
    const keep_ms = 1000;
    const touchpoints = [];
    function registerTouch(e) {
        const touch = e.touches[0] || e.changedTouches[0];
        const point = { x: touch.pageX, y: touch.pageY };
        touchpoints.push(point);
        setTimeout(function () {
            touchpoints.splice(touchpoints.indexOf(point), 1);
        }, keep_ms);
        if (e.type === 'touchend') {
            document.addEventListener('mouseover', handleMouseEvent, true);
        }
        else {
            document.body.classList.add('no-hover');
        }
    }
    function handleMouseEvent(e) {
        for (const i in touchpoints) {
            if (Math.abs(touchpoints[i].x - e.pageX) < 2 && Math.abs(touchpoints[i].y - e.pageY) < 2) {
                e.triggeredByTouch = true;
                return;
            }
        }
        document.removeEventListener('mouseover', handleMouseEvent, true);
        document.body.classList.remove('no-hover');
    }
    return () => {
        document.addEventListener('touchstart', registerTouch, true);
        document.addEventListener('touchend', registerTouch, true);
    };
}
export class HoverControllerModule {
}
HoverControllerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: HoverControllerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
HoverControllerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: HoverControllerModule });
HoverControllerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: HoverControllerModule, providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: setHoverClass,
            multi: true
        }
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: HoverControllerModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [
                        {
                            provide: APP_INITIALIZER,
                            useFactory: setHoverClass,
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG92ZXItY29udHJvbGxlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC10aGVtZS9tYXRlcmlhbC10aGVtZS9zcmMvbGliL2hvdmVyLWNvbnRyb2xsZXIvaG92ZXItY29udHJvbGxlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRXhELE1BQU0sVUFBVSxhQUFhO0lBQzNCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQTtJQUNwQixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUE7SUFFdEIsU0FBUyxhQUFhLENBQUMsQ0FBQztRQUN0QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakQsTUFBTSxLQUFLLEdBQUcsRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBQyxDQUFBO1FBQzlDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdkIsVUFBVSxDQUFDO1lBQ1QsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ25ELENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDekIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUMvRDthQUFNO1lBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELFNBQVMsZ0JBQWdCLENBQUMsQ0FBQztRQUN6QixLQUFLLE1BQU0sQ0FBQyxJQUFJLFdBQVcsRUFBRTtZQUMzQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN4RixDQUFDLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFBO2dCQUN6QixPQUFNO2FBQ1A7U0FDRjtRQUNELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxPQUFPLEdBQUcsRUFBRTtRQUNWLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQTtBQUNILENBQUM7QUFZRCxNQUFNLE9BQU8scUJBQXFCOztrSEFBckIscUJBQXFCO21IQUFyQixxQkFBcUI7bUhBQXJCLHFCQUFxQixhQVJyQjtRQUNUO1lBQ0UsT0FBTyxFQUFFLGVBQWU7WUFDeEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsS0FBSyxFQUFFLElBQUk7U0FDWjtLQUNGOzJGQUVVLHFCQUFxQjtrQkFUakMsUUFBUTttQkFBQztvQkFDUixTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLGVBQWU7NEJBQ3hCLFVBQVUsRUFBRSxhQUFhOzRCQUN6QixLQUFLLEVBQUUsSUFBSTt5QkFDWjtxQkFDRjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRIb3ZlckNsYXNzKCkge1xuICBjb25zdCBrZWVwX21zID0gMTAwMFxuICBjb25zdCB0b3VjaHBvaW50cyA9IFtdXG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJUb3VjaChlKSB7XG4gICAgY29uc3QgdG91Y2ggPSBlLnRvdWNoZXNbMF0gfHwgZS5jaGFuZ2VkVG91Y2hlc1swXVxuICAgIGNvbnN0IHBvaW50ID0ge3g6IHRvdWNoLnBhZ2VYLCB5OiB0b3VjaC5wYWdlWX1cbiAgICB0b3VjaHBvaW50cy5wdXNoKHBvaW50KVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdG91Y2hwb2ludHMuc3BsaWNlKHRvdWNocG9pbnRzLmluZGV4T2YocG9pbnQpLCAxKVxuICAgIH0sIGtlZXBfbXMpXG4gICAgaWYgKGUudHlwZSA9PT0gJ3RvdWNoZW5kJykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgaGFuZGxlTW91c2VFdmVudCwgdHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCduby1ob3ZlcicpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU1vdXNlRXZlbnQoZSkge1xuICAgIGZvciAoY29uc3QgaSBpbiB0b3VjaHBvaW50cykge1xuICAgICAgaWYgKE1hdGguYWJzKHRvdWNocG9pbnRzW2ldLnggLSBlLnBhZ2VYKSA8IDIgJiYgTWF0aC5hYnModG91Y2hwb2ludHNbaV0ueSAtIGUucGFnZVkpIDwgMikge1xuICAgICAgICBlLnRyaWdnZXJlZEJ5VG91Y2ggPSB0cnVlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBoYW5kbGVNb3VzZUV2ZW50LCB0cnVlKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLWhvdmVyJyk7XG4gIH1cblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCByZWdpc3RlclRvdWNoLCB0cnVlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHJlZ2lzdGVyVG91Y2gsIHRydWUpO1xuICB9XG59XG5cblxuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgdXNlRmFjdG9yeTogc2V0SG92ZXJDbGFzcyxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEhvdmVyQ29udHJvbGxlck1vZHVsZSB7IH1cbiJdfQ==