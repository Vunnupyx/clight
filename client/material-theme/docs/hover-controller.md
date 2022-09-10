# Hover Controller

This module detects either touch or mouse input and disables/enables the hover styles, accordingly. 

Therefore, as soon as a touch event was detected, a global css-class (`no-hover`) is added to the body of the document.

As soon as a mouse event was detected, the class is removed again.

The Angular Material Components are already optimized to this behaviour through the theme.

## Integration
app.module.ts
``` typescript
imports: [
  // other imports
  HoverControllerModule
]
```

### Caution!

This only works with Angular Material Components! In order to use this with other elements, please apply the hover stylings in the following way:

``` css
body:not(.no-hover) &:hover {
  // your hover stylings
}
```
