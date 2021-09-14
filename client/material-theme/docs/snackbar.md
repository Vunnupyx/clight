# Tabs Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/snack-bar/overview)).

## Development Guidelines

### Custom Rules

When opening a snackbar, the API provides a default function, which takes a config object as a parameter. This objects contains a property called *panelClass*, which applies a css class to the snackbar element.

Therefore, the custom classes defined below are supposed to be applied using the default function in the controller instead of the html element.

| Class name      | Description                                                       |
|-----------------|-------------------------------------------------------------------|
| success         | Applies a green color to the snackbar                             |
| information     | Applies a grey color to the snackbar                              |
| warning         | Applies an orange color to the snackbar                           |
| error           | Applies a red color to the snackbar                               |

## Code Examples

``` html
  <button mat-raised-button (click)="openSnackBar('Short success', '', 'success')"
          aria-label="Show an example snack-bar">
    Go
  </button>
```
``` typescript
  openSnackBar(message: string, action: string, cssClass: string): void {
    this.snackBar.open(message, action, {
      duration: 0,
      panelClass: cssClass,
      verticalPosition: "top"
    });
  }
```
