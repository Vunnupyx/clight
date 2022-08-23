# DMG Header Component

This component should be embedded in the sidenav menu and applies a Header, Subheader and an optional Column Layout as designed to the page.

Header and Subheader are extracted from the routing data.

## Input Options

| Key           | Default  | Description                                                                                |
|---------------|----------|--------------------------------------------------------------------------------------------|
| includeLayout | true     | Can be used to deselect the grid layout which is by default applied to the child element   |


## Implementation

app.component.html:

````html
<ng-container>
  <cn-sidenav-container>
    <cn-sidenav>
      <cn-nav-list>
        <cn-nav-list-item text="Child" route=""></cn-nav-list-item>
        ...
      </cn-nav-list>
    </cn-sidenav>
    <cn-sidenav-content class="content">
      <dmg-header>
        <router-outlet></router-outlet>
      </dmg-header>
    </cn-sidenav-content>
  </cn-sidenav-container>
</ng-container>
````

without grid layout: 

````html
<dmg-header [includeLayout]="false">
  <router-outlet></router-outlet>
</dmg-header>
````

app.routing.ts:

````typescript
const routes: Routes = [
  {
    path: '',
    component: ChildComponent,
    data: {
      header: "Child Header",
      subheader: "Child Subheader"
    }
  },
];
````
