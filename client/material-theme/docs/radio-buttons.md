# Radio Buttons Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/radio/overview)).

## Development Guidelines

No custom rules are applied to the radio buttons component.

## Code Examples

``` html
<mat-radio-group aria-label="Select an option" fxLayout="column">
    <mat-radio-button value="1" class="spacing-bottom-xs">Option 1</mat-radio-button>
    <mat-radio-button value="2" [checked]="true" class="spacing-bottom-xs">Option 2</mat-radio-button>
    <mat-radio-button value="4" [disabled]="true" class="spacing-bottom-xs">Option 3</mat-radio-button>
</mat-radio-group>
```
