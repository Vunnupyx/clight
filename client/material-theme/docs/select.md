# Select Component

The DMG MORI Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/select/overview)).

## Development Guidelines

### Angular Material Rules

In order to place the options panel underneath the input field, the option 'disableOptionCentering' must be applied to the component.

### Custom Rules

Along with the Angular Material API, the following custom classes are enabled by the theme:

| Class name | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
| floating   | changes the box-shadow of the input field for an outward going design |

## Code Examples

```html
<mat-form-field class="spacing-x-s">
  <mat-label>Choose an option</mat-label>
  <mat-select disableOptionCentering>
    <mat-option value="option1">Option 1</mat-option>
    <mat-option value="option2" disabled>Option 2 (disabled)</mat-option>
    <mat-option value="option3">Option 3</mat-option>
  </mat-select>
</mat-form-field>
```
