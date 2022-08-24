# Chips Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/chips/overview)).

## Development Guidelines

### Angular Material Rules

Caution! 
The standard Angular Material Chips are only selectable by focusing the chip and the hitting SPACE.
As a workaroud the following code snippets will enable the chip to be selectable through a click only:

``` html
<mat-chip 
  #apple="matChip"
  (click)="apple.toggleSelected()">
    Apple
</mat-chip>
```

### Custom Rules

Along with the Angular Material API, the following custom classes are enabled by the theme:

| Class name          | Description                                                            |
|---------------------|------------------------------------------------------------------------|
| number-indicator    | Applied to a div element inside the chip, adds an indication field     |

Also, if an icon is added inside the chips component, the size of the icon is scaled down dynamically.


## Code Examples

``` html
<mat-chip-list>
  <mat-chip>Apple</mat-chip>
  <mat-chip>
    <mat-icon class="material-icons-outlined">
      favorite
    </mat-icon>
    Pear</mat-chip>
  <mat-chip>Pineapple</mat-chip>
</mat-chip-list>
```

Number indication:
``` html
<mat-chip>
  Banana
  <div class="number-indicator">
    25
  </div>
</mat-chip>
```

