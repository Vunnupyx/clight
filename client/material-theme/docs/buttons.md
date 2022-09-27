# Button Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/button/overview)).

## Development Guidelines

### Angular Material Rules

In the Sofia Design the following button variants are used, which should be used in application development primarily:
- mat-fab
- mat-button

**DEPRECATED** (from v13.9/12.9):
- mat-raised-button
- mat-fab-mini

Also, the *color* property within the component should only get the following values:
- primary (blue) - *default*
- secondary (white/grey)
- danger (red)
- ghost (transparent. blue font)
- ghost-danger (transparent, red font)

If no color property is specified, the primary colors will be applied.

### Custom Rules

Along with the Angular Material API, the following custom classes are enabled by the theme:

| Class name      | Variants         | Description                           |
|-----------------|------------------|---------------------------------------|
| sofia-btn-justified   | mat-button       | Applies a width of 100% to the button |


## Code Examples

#### Colors

Primary:
``` html
<button mat-button color="primary">
  {{buttonText}}
</button>
```

Secondary:
``` html
<button mat-button color="secondary">
  {{buttonText}}
</button>
```

Danger:
``` html
<button mat-button color="danger">
  {{buttonText}}
</button>
```

Ghost:
``` html
<button mat-button color="ghost">
  {{buttonText}}
</button>
```

Ghost Danger:
``` html
<button mat-button color="ghost-danger">
  {{buttonText}}
</button>
```

#### Fab Button

``` html
<button mat-fab color="primary">
  {{buttonText}}
</button>
```

#### Justified

``` html
<button mat-button color="primary" class="sofia-btn-justified">
  {{buttonText}}
</button>
```

#### With Icon

``` html
<button mat-button color="primary">
  {{buttonText}}
  <mat-icon>crop_square</mat-icon>   // alternative: cn-icon component
</button>
```

#### Disabled

``` html
<button mat-button color="primary" [disabled]="btnDisabled">
  {{buttonText}}
</button>
```
