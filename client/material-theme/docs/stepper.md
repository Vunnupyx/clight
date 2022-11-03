# Stepper Component

The DMG MORI Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/stepper/overview)).

## Development Guidelines

No custom rules are applied to the stepper component.

## Code Examples

```html
<mat-horizontal-stepper [linear]="true" #stepper>
  <mat-step [stepControl]="firstFormGroup">
    <form [formGroup]="firstFormGroup">
      <ng-template matStepLabel>Fill out your name</ng-template>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input
          matInput
          placeholder="Last name, First name"
          formControlName="firstCtrl"
          required
        />
      </mat-form-field>
      <div>
        <button mat-raised-button matStepperNext>Next</button>
      </div>
    </form>
  </mat-step>
  <mat-step [stepControl]="secondFormGroup" label="Fill out your address">
    <form [formGroup]="secondFormGroup">
      <mat-form-field>
        <mat-label>Address</mat-label>
        <input
          matInput
          formControlName="secondCtrl"
          placeholder="Ex. 1 Main St, New York, NY"
          required
        />
      </mat-form-field>
      <div>
        <button mat-raised-button matStepperPrevious>Back</button>
        <button mat-raised-button matStepperNext>Next</button>
      </div>
    </form>
  </mat-step>
  <mat-step>
    <ng-template matStepLabel>Done</ng-template>
    <p>You are now done.</p>
    <div>
      <button mat-raised-button matStepperPrevious>Back</button>
      <button mat-raised-button (click)="stepper.reset()">Reset</button>
    </div>
  </mat-step>
</mat-horizontal-stepper>
```
