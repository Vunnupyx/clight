# Card Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/card/overview)).

## Development Guidelines

### Custom Rules
In the DMG Mori Design System, two types of elevation are available, which are enabled by applying the following class names to the component:

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

``` html
<mat-card class="elevation-1">
  <mat-card-header>
    <div mat-card-avatar class="example-header-image"></div>
    <mat-card-title>Shiba Inu</mat-card-title>
    <mat-card-subtitle>Dog Breed</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>
      The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.
      A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally
      bred for hunting.
    </p>
  </mat-card-content>
  <mat-card-actions>
    <button mat-raised-button color="secondary">LIKE</button>
    <button mat-raised-button color="primary">SHARE</button>
  </mat-card-actions>
</mat-card>
```
