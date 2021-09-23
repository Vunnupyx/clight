# Input Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/input/overview)).

## Development Guidelines

No custom rules are applied to the input component.

## Code Examples

Simple Input Field with Placeholder:

```html
<mat-form-field>
  <mat-label>Favorite food</mat-label>
  <input matInput placeholder="Ex. Pizza" value="Sushi" />
</mat-form-field>
```

Input Field with Error Message:

```html
<mat-form-field class="spacing-x-s">
  <mat-label>Email</mat-label>
  <input
    type="email"
    matInput
    [formControl]="emailFormControl"
    [errorStateMatcher]="matcher"
    placeholder="Ex. pat@example.com"
  />
  <mat-hint>Errors appear instantly!</mat-hint>
  <mat-error *ngIf="emailFormControl.hasError('required')">
    Email is <strong>required</strong>
  </mat-error>
</mat-form-field>
```

Input Field with Prefix and Suffix:

```html
<mat-form-field class="spacing-x-s">
  <mat-label>Telephone</mat-label>
  <span matPrefix>+1 &nbsp;</span>
  <input type="tel" matInput placeholder="555-555-1234" />
  <mat-icon matSuffix>mode_edit</mat-icon>
</mat-form-field>
```
