# Card Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/card/overview)).

## Development Guidelines

The card component is used for two different use cases: a data display or a container. 
The container is supposed to group other elements together and has a variable content, 
whereas the data display should only contain grouped fata, text or an image.

### Custom Rules

#### Container

| Class name                       | Description                                                                                     |
|----------------------------------|-------------------------------------------------------------------------------------------------|
| sofia-container                  | Marks the card as a container element (if no level is specified, the core stylings are applied) |
| sofia-container-primary          | In combination with the container class, applies the primary stylings.                          |
| sofia-container-secondary        | In combination with the container class, applies the secondary stylings.                        |
| sofia-container-tertiary         | In combination with the container class, applies the tertiary stylings.                         |
| sofia-container-footer-separator | Applied to the <mat-card-footer> section adds a vertical separater between the child elements   |


#### Data Display

| Class name            | Description                                                                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| sofia-card-primary    | Applies the primary stylings to the data display card.                                                                                         |
| sofia-card-secondary  | Applies the secondary stylings to the data display card.                                                                                       |
| sofia-card-selectable | In combination with a checkbox in the header, applies a hover effect to the card.                                                              |
| sofia-no-auto-order   | Applied to a child icon/button element of <mat-card-header> section removes the auto-order styling and enables the use of an icon as an avatar |
| disabled              | Marks the card as disabled and applies stylings, accordingly.                                                                                  |




**!! DEPRECATED !!**

The following classes can be applied to the card component, as well, but they will not be available in the future:

| Class name      | Description                                                               |
|-----------------|---------------------------------------------------------------------------|
| elevation-1     | Applies a 06dp elevation to the card                                      |
| elevation-2     | Applies a 09dp elevation to the card                                      |
| border-success  | Applies a green border to the card                                        |
| border-warning  | Applies an orange border to the card                                      |
| border-default  | Applies a grey border and a 04dp elevation to the card                    |
| border-dashed-1 | Applies a dashed border with a 1px strength to the card                   |
| border-dashed-2 | Applies a dashed border with a 2px strength to the card                   |
| bg-grey         | Applies a grey background to the card                                     |
| bg-radius-8     | Applies an 8px border radius to the card                                  |

If no elevation class is specified on the card, the Angular Material default style is applied.

## Code Examples

Container: 
``` html
<mat-card class="container primary">
  <mat-card-title>Container</mat-card-title>
  <mat-card-subtitle>Additional Description if needed</mat-card-subtitle>
</mat-card-header>
<mat-card-content fxLayout="column" fxLayoutGap="16px">
  <div fxLayout="row" fxLayoutGap="16px" *ngFor="let n of [0,1]">
    <mat-card *ngFor="let n of [0,1,2]"
      class="secondary"
      <mat-card-header>
        <mat-card-title>Title</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam
        </p>
      </mat-card-content>
    </mat-card>
  </div>
</mat-card-content>
<mat-card-footer>
  6 items
</mat-card-footer>
```

Container with footer-separator: 
``` html
<mat-card class="container primary">
  <mat-card-title>Container</mat-card-title>
  <mat-card-subtitle>Additional Description if needed</mat-card-subtitle>
</mat-card-header>
<mat-card-content fxLayout="column" fxLayoutGap="16px">
  <div fxLayout="row" fxLayoutGap="16px" *ngFor="let n of [0,1]">
    <mat-card *ngFor="let n of [0,1,2]"
      class="secondary"
      <mat-card-header>
        <mat-card-title>Title</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam
        </p>
      </mat-card-content>
    </mat-card>
  </div>
</mat-card-content>
<mat-card-footer class="sofia-container-footer-separator">
  <p>6 items</p>
  <p>3 critical</p>
</mat-card-footer>
```


Data Display: 
``` html
<mat-card class="selectable primary">
  <mat-card-header>
    <mat-checkbox [disabled]="disabled"></mat-checkbox>
    <mat-card-title>Card Title</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <p>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
      invidunt ut labore et dolore magna aliquyam erat, sed diam
    </p>
  </mat-card-content>
</mat-card>
```
