# Toggle Button Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/button-toggle/overview)).

## Development Guidelines

### Custom Rules

Along with the Angular Material API, the following custom classes are enabled by the theme:

| Class name | Variants                     | Description                         |
| ---------- | ---------------------------- | ----------------------------------- |
| raised     | mat-button-toggle (no group) | Applies a box-shadow to the element |

## Code Examples

#### Toggle Button Group

```html
<mat-button-toggle-group name="fontStyle" aria-label="Font Style">
  <mat-button-toggle value="bold">Bold</mat-button-toggle>
  <mat-button-toggle value="italic">Italic</mat-button-toggle>
  <mat-button-toggle value="underline">Underline</mat-button-toggle>
</mat-button-toggle-group>
```

#### Single Toggle Button

Default:

```html
<mat-button-toggle>
  <mat-icon>visibility</mat-icon>
</mat-button-toggle>
```

Raised:

```html
<mat-button-toggle class="raised">
  <mat-icon>visibility</mat-icon>
</mat-button-toggle>
```
