import { BREAKPOINT } from '@angular/flex-layout';
export const CELOSNEXT_BREAKPOINTS = [{
        alias: 'xxs',
        suffix: 'xxsScreen',
        mediaQuery: 'screen and (max-width: 479.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xs',
        suffix: 'xsScreen',
        mediaQuery: 'screen and (min-width: 480px) and (max-width: 575.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-xs',
        suffix: 'gtXsScreen',
        mediaQuery: 'screen and (min-width: 480px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-xs',
        suffix: 'ltXsScreen',
        mediaQuery: 'screen and (max-width: 575.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'sm',
        suffix: 'smScreen',
        mediaQuery: 'screen and (min-width: 576px) and (max-width: 767.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-sm',
        suffix: 'gtSmScreen',
        mediaQuery: 'screen and (min-width: 576px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-sm',
        suffix: 'ltSmScreen',
        mediaQuery: 'screen and (max-width: 767.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'md',
        suffix: 'mdScreen',
        mediaQuery: 'screen and (min-width: 768px) and (max-width: 991.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-md',
        suffix: 'gtMdScreen',
        mediaQuery: 'screen and (min-width: 768px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-md',
        suffix: 'ltMdScreen',
        mediaQuery: 'screen and (max-width: 991.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lg',
        suffix: 'lgScreen',
        mediaQuery: 'screen and (min-width: 992px) and (max-width: 1280.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-lg',
        suffix: 'gtLgScreen',
        mediaQuery: 'screen and (min-width: 992px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-lg',
        suffix: 'ltLgScreen',
        mediaQuery: 'screen and (max-width: 1280.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xl',
        suffix: 'xlScreen',
        mediaQuery: 'screen and (min-width: 1281px) and (max-width: 1919.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-xl',
        suffix: 'gtXlScreen',
        mediaQuery: 'screen and (min-width: 1281px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-xl',
        suffix: 'ltXlScreen',
        mediaQuery: 'screen and (max-width: 1919.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xxl',
        suffix: 'xxlScreen',
        mediaQuery: 'screen and (min-width: 1920px)',
        overlapping: false,
        priority: 1001
    }];
export const CelosNextBreakPointsProvider = {
    provide: BREAKPOINT,
    useValue: CELOSNEXT_BREAKPOINTS,
    multi: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Vsb3NuZXh0LWJyZWFrcG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtdGhlbWUvc3JjL2xpYi9sYXlvdXQvY2Vsb3NuZXh0LWJyZWFrcG9pbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQWEsTUFBTSxzQkFBc0IsQ0FBQztBQUU1RCxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FDbEMsQ0FBQztRQUNHLEtBQUssRUFBRSxLQUFLO1FBQ1osTUFBTSxFQUFFLFdBQVc7UUFDbkIsVUFBVSxFQUFFLGlDQUFpQztRQUM3QyxXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUUsSUFBSTtLQUNqQixFQUFDO1FBQ0UsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsVUFBVTtRQUNsQixVQUFVLEVBQUUsd0RBQXdEO1FBQ3BFLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxJQUFJO0tBQ2pCLEVBQUM7UUFDRSxLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFVBQVUsRUFBRSwrQkFBK0I7UUFDM0MsV0FBVyxFQUFFLEtBQUs7UUFDbEIsUUFBUSxFQUFFLElBQUk7S0FDakIsRUFBQztRQUNFLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLFlBQVk7UUFDcEIsVUFBVSxFQUFFLGlDQUFpQztRQUM3QyxXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUUsSUFBSTtLQUNqQixFQUFDO1FBQ0UsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsVUFBVTtRQUNsQixVQUFVLEVBQUUsd0RBQXdEO1FBQ3BFLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxJQUFJO0tBQ2pCLEVBQUM7UUFDRSxLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFVBQVUsRUFBRSwrQkFBK0I7UUFDM0MsV0FBVyxFQUFFLEtBQUs7UUFDbEIsUUFBUSxFQUFFLElBQUk7S0FDakIsRUFBQztRQUNFLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLFlBQVk7UUFDcEIsVUFBVSxFQUFFLGlDQUFpQztRQUM3QyxXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUUsSUFBSTtLQUNqQixFQUFDO1FBQ0UsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsVUFBVTtRQUNsQixVQUFVLEVBQUUsd0RBQXdEO1FBQ3BFLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxJQUFJO0tBQ2pCLEVBQUM7UUFDRSxLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFVBQVUsRUFBRSwrQkFBK0I7UUFDM0MsV0FBVyxFQUFFLEtBQUs7UUFDbEIsUUFBUSxFQUFFLElBQUk7S0FDakIsRUFBQztRQUNFLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLFlBQVk7UUFDcEIsVUFBVSxFQUFFLGlDQUFpQztRQUM3QyxXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUUsSUFBSTtLQUNqQixFQUFDO1FBQ0UsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsVUFBVTtRQUNsQixVQUFVLEVBQUUseURBQXlEO1FBQ3JFLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxJQUFJO0tBQ2pCLEVBQUM7UUFDRSxLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFVBQVUsRUFBRSwrQkFBK0I7UUFDM0MsV0FBVyxFQUFFLEtBQUs7UUFDbEIsUUFBUSxFQUFFLElBQUk7S0FDakIsRUFBQztRQUNFLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLFlBQVk7UUFDcEIsVUFBVSxFQUFFLGtDQUFrQztRQUM5QyxXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUUsSUFBSTtLQUNqQixFQUFDO1FBQ0UsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsVUFBVTtRQUNsQixVQUFVLEVBQUUsMERBQTBEO1FBQ3RFLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxJQUFJO0tBQ2pCLEVBQUM7UUFDRSxLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFVBQVUsRUFBRSxnQ0FBZ0M7UUFDNUMsV0FBVyxFQUFFLEtBQUs7UUFDbEIsUUFBUSxFQUFFLElBQUk7S0FDakIsRUFBQztRQUNFLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLFlBQVk7UUFDcEIsVUFBVSxFQUFFLGtDQUFrQztRQUM5QyxXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUUsSUFBSTtLQUNqQixFQUFDO1FBQ0UsS0FBSyxFQUFFLEtBQUs7UUFDWixNQUFNLEVBQUUsV0FBVztRQUNuQixVQUFVLEVBQUUsZ0NBQWdDO1FBQzVDLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxJQUFJO0tBQ2pCLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHO0lBQ3hDLE9BQU8sRUFBRSxVQUFVO0lBQ25CLFFBQVEsRUFBRSxxQkFBcUI7SUFDL0IsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtCUkVBS1BPSU5ULCBCcmVha1BvaW50fSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XG5cbmV4cG9ydCBjb25zdCBDRUxPU05FWFRfQlJFQUtQT0lOVFM6IEJyZWFrUG9pbnRbXSA9IFxuW3tcbiAgICBhbGlhczogJ3h4cycsXG4gICAgc3VmZml4OiAneHhzU2NyZWVuJyxcbiAgICBtZWRpYVF1ZXJ5OiAnc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0NzkuOXB4KScsXG4gICAgb3ZlcmxhcHBpbmc6IGZhbHNlLFxuICAgIHByaW9yaXR5OiAxMDAxXG59LHtcbiAgICBhbGlhczogJ3hzJyxcbiAgICBzdWZmaXg6ICd4c1NjcmVlbicsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogNDgwcHgpIGFuZCAobWF4LXdpZHRoOiA1NzUuOXB4KScsXG4gICAgb3ZlcmxhcHBpbmc6IGZhbHNlLFxuICAgIHByaW9yaXR5OiAxMDAxXG59LHtcbiAgICBhbGlhczogJ2d0LXhzJyxcbiAgICBzdWZmaXg6ICdndFhzU2NyZWVuJyxcbiAgICBtZWRpYVF1ZXJ5OiAnc2NyZWVuIGFuZCAobWluLXdpZHRoOiA0ODBweCknLFxuICAgIG92ZXJsYXBwaW5nOiBmYWxzZSxcbiAgICBwcmlvcml0eTogMTAwMVxufSx7XG4gICAgYWxpYXM6ICdsdC14cycsXG4gICAgc3VmZml4OiAnbHRYc1NjcmVlbicsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1heC13aWR0aDogNTc1LjlweCknLFxuICAgIG92ZXJsYXBwaW5nOiBmYWxzZSxcbiAgICBwcmlvcml0eTogMTAwMVxufSx7XG4gICAgYWxpYXM6ICdzbScsXG4gICAgc3VmZml4OiAnc21TY3JlZW4nLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtaW4td2lkdGg6IDU3NnB4KSBhbmQgKG1heC13aWR0aDogNzY3LjlweCknLFxuICAgIG92ZXJsYXBwaW5nOiBmYWxzZSxcbiAgICBwcmlvcml0eTogMTAwMVxufSx7XG4gICAgYWxpYXM6ICdndC1zbScsXG4gICAgc3VmZml4OiAnZ3RTbVNjcmVlbicsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogNTc2cHgpJyxcbiAgICBvdmVybGFwcGluZzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDEwMDFcbn0se1xuICAgIGFsaWFzOiAnbHQtc20nLFxuICAgIHN1ZmZpeDogJ2x0U21TY3JlZW4nLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2Ny45cHgpJyxcbiAgICBvdmVybGFwcGluZzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDEwMDFcbn0se1xuICAgIGFsaWFzOiAnbWQnLFxuICAgIHN1ZmZpeDogJ21kU2NyZWVuJyxcbiAgICBtZWRpYVF1ZXJ5OiAnc2NyZWVuIGFuZCAobWluLXdpZHRoOiA3NjhweCkgYW5kIChtYXgtd2lkdGg6IDk5MS45cHgpJyxcbiAgICBvdmVybGFwcGluZzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDEwMDFcbn0se1xuICAgIGFsaWFzOiAnZ3QtbWQnLFxuICAgIHN1ZmZpeDogJ2d0TWRTY3JlZW4nLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtaW4td2lkdGg6IDc2OHB4KScsXG4gICAgb3ZlcmxhcHBpbmc6IGZhbHNlLFxuICAgIHByaW9yaXR5OiAxMDAxXG59LHtcbiAgICBhbGlhczogJ2x0LW1kJyxcbiAgICBzdWZmaXg6ICdsdE1kU2NyZWVuJyxcbiAgICBtZWRpYVF1ZXJ5OiAnc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA5OTEuOXB4KScsXG4gICAgb3ZlcmxhcHBpbmc6IGZhbHNlLFxuICAgIHByaW9yaXR5OiAxMDAxXG59LHtcbiAgICBhbGlhczogJ2xnJyxcbiAgICBzdWZmaXg6ICdsZ1NjcmVlbicsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogOTkycHgpIGFuZCAobWF4LXdpZHRoOiAxMjgwLjlweCknLFxuICAgIG92ZXJsYXBwaW5nOiBmYWxzZSxcbiAgICBwcmlvcml0eTogMTAwMVxufSx7XG4gICAgYWxpYXM6ICdndC1sZycsXG4gICAgc3VmZml4OiAnZ3RMZ1NjcmVlbicsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogOTkycHgpJyxcbiAgICBvdmVybGFwcGluZzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDEwMDFcbn0se1xuICAgIGFsaWFzOiAnbHQtbGcnLFxuICAgIHN1ZmZpeDogJ2x0TGdTY3JlZW4nLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEyODAuOXB4KScsXG4gICAgb3ZlcmxhcHBpbmc6IGZhbHNlLFxuICAgIHByaW9yaXR5OiAxMDAxXG59LHtcbiAgICBhbGlhczogJ3hsJyxcbiAgICBzdWZmaXg6ICd4bFNjcmVlbicsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogMTI4MXB4KSBhbmQgKG1heC13aWR0aDogMTkxOS45cHgpJyxcbiAgICBvdmVybGFwcGluZzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDEwMDFcbn0se1xuICAgIGFsaWFzOiAnZ3QteGwnLFxuICAgIHN1ZmZpeDogJ2d0WGxTY3JlZW4nLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtaW4td2lkdGg6IDEyODFweCknLFxuICAgIG92ZXJsYXBwaW5nOiBmYWxzZSxcbiAgICBwcmlvcml0eTogMTAwMVxufSx7XG4gICAgYWxpYXM6ICdsdC14bCcsXG4gICAgc3VmZml4OiAnbHRYbFNjcmVlbicsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1heC13aWR0aDogMTkxOS45cHgpJyxcbiAgICBvdmVybGFwcGluZzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDEwMDFcbn0se1xuICAgIGFsaWFzOiAneHhsJyxcbiAgICBzdWZmaXg6ICd4eGxTY3JlZW4nLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtaW4td2lkdGg6IDE5MjBweCknLFxuICAgIG92ZXJsYXBwaW5nOiBmYWxzZSxcbiAgICBwcmlvcml0eTogMTAwMVxufV07XG5cbmV4cG9ydCBjb25zdCBDZWxvc05leHRCcmVha1BvaW50c1Byb3ZpZGVyID0ge1xuICAgIHByb3ZpZGU6IEJSRUFLUE9JTlQsXG4gICAgdXNlVmFsdWU6IENFTE9TTkVYVF9CUkVBS1BPSU5UUyxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbiJdfQ==