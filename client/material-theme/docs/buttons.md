# Button Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/button/overview)).

## Development Guidelines

### Angular Material Rules

In the Sofia Design the following button variants are used, which should be used in application development primarily:
- mat-raised-button
- mat-fab
- mat-fab-mini
- mat-button

Also, the *color* property within the component should only get the following values:
- primary (blue color) - *default*
- secondary (white color)

If no color property is specified, the primary colors will be applied.

### Custom Rules

Along with the Angular Material API, the following custom classes are enabled by the theme:

| Class name      | Variants           | Description                                                       |
|-----------------|--------------------|-------------------------------------------------------------------|
| large           | mat-raised-button, | Applies a height of 56px to the button instead of the default     |
|                 | (mat-flat-button)  | height of 48px.                                                   |
| fab-extended    | mat-fab            | Applies a width of 125px to the Fab Button.                       |


## Code Examples

#### Primary

Default size:

`<button mat-raised-button color="primary"><mat-icon>add</mat-icon>Primary</button>`

Large size:

`<button mat-raised-button class="large" color="primary"><mat-icon>add</mat-icon>Primary</button>`

#### Secondary

Default size:

`<button mat-raised-button color="secondary"><mat-icon>add</mat-icon>Secondary</button>`

Large size:

`<button mat-raised-button class="large" color="secondary"><mat-icon>add</mat-icon>Secondary</button>`

#### Fab

Default:

`<button mat-fab color="primary"><mat-icon>add</mat-icon></button>`

Extended:

`<button mat-fab class="fab-extended" color="primary"><mat-icon>add</mat-icon>Create</button>`

#### Fab Mini

`<button mat-mini-fab color="primary"><mat-icon>add</mat-icon></button>`
