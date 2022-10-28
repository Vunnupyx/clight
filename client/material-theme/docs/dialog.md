# Dialog Component

The DMG MORI Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/dialog/overview)).

## Development Guidelines

No custom rules are applied to the dialog component.

## Code Examples

```html
<button mat-raised-button (click)="openDialog()">Open dialog</button>
```

```typescript
constructor(public dialog: MatDialog) {}

openDialog(): void {
  const dialogRef = this.dialog.open(DialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    // action
  });
}
```

Dialog Component:

```html
<h2 mat-dialog-title>Install Angular</h2>
<mat-dialog-content>
  <h3>Develop across all platforms</h3>
  <p>
    Learn one way to build applications with Angular and reuse your code and
    abilities to build apps for any deployment target. For web, mobile web,
    native mobile and native desktop.
  </p>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-raised-button color="secondary" matDialogClose>Cancel</button>
  <button
    mat-raised-button
    color="primary"
    [matDialogClose]="true"
    cdkFocusInitial
  >
    Install
  </button>
</mat-dialog-actions>
```

```html
@Component({ selector: 'app-dialog', templateUrl: './dialog.html', }) export
class DialogComponent {}
```
