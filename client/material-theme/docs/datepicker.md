# Datepicker Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/datepicker/overview)).

## Development Guidelines

No custom rules are applied to the datepicker component.

## Code Examples

``` html
<mat-form-field class="spacing-x-s">
    <mat-label>Choose a date</mat-label>
    <input matInput [matDatepicker]="picker">
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```
