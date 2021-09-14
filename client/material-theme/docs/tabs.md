# Tabs Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/tabs/overview)).

## Development Guidelines

No custom rules are applied to the tabs component.

## Code Examples

``` html
<mat-tab-group mat-align-tabs="start">
    <mat-tab>
      <ng-template mat-tab-label>
        <span matBadge="4" matBadgeOverlap="false">First</span>
      </ng-template>
      Content 1
    </mat-tab>
    <mat-tab label="Second">Content 2</mat-tab>
    <mat-tab label="Third">Content 3</mat-tab>
</mat-tab-group>
```
