# Table Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/table/overview)).

## Development Guidelines

### Custom Rules

Along with the Angular Material API, the following custom classes are enabled by the theme:

| Class name              | Description                                                                                |
|-------------------------|--------------------------------------------------------------------------------------------|
| sofia-table-tall        | Applies a height of 64px to all cells of the table (header and data cells) - default: 48px |
| sofia-table-row-warning | Applies a yellow warning indicator to the row                                              |


## Code Examples

#### Simple
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>
<div class="sofia-table-container">
  <table mat-table [dataSource]="dataSource">
  
    <!-- Column Definitions -->
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```

#### Extended Headline
Description:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <div>
    <h2>Data Table Title</h2>
    <h4>Additional description if needed</h4>
  </div>
</div>
<div class="sofia-table-container">
  <table mat-table [dataSource]="dataSource">
  
    <!-- Column Definitions -->
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```
Action Button:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <div>
    <h2>Data Table Title</h2>
    <h4>Additional description if needed</h4>
  </div>
  <button mat-button color="primary">Primary Button</button>
</div>
<div class="sofia-table-container">
  <table mat-table [dataSource]="dataSource">
  
    <!-- Column Definitions -->
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```

#### Interaction Spacer
Filter:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>
<div class="sofia-interaction-spacer" fxLayout="row" fxLayoutAlign="space-between center">
  <mat-chip-list #chipList>
    <mat-basic-chip #filter="matChip" (click)="apply(filterValue)">
      <!-- Description -->
      <div class="sofia-number-indicator">
        <!-- Amount -->
      </div>
    </mat-basic-chip>
    
    <!-- more filter chips -->
    
  </mat-chip-list>
</div>
<div class="sofia-table-container">
  <table mat-table [dataSource]="dataSource">
  
    <!-- Column Definitions -->
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```
Search:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>
<div class="sofia-interaction-spacer" fxLayout="row" fxLayoutAlign="space-between center">
  <mat-chip-list #chipList>
    <mat-basic-chip #filter="matChip" (click)="apply(filterValue)">
      <!-- Description -->
      <div class="sofia-number-indicator">
        <!-- Amount -->
      </div>
    </mat-basic-chip>
    
    <!-- more filter chips -->
    
  </mat-chip-list>
  <mat-form-field>
    <input matInput type="text" (keyup)="apply($event)">
    <span matSuffix><mat-icon>search</mat-icon></span> <!-- alternative: cn-icon component-->
  </mat-form-field>
</div>
<div class="sofia-table-container">
  <table mat-table [dataSource]="dataSource">
  
    <!-- Column Definitions -->
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```
Filter and Search:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>
<div class="sofia-interaction-spacer" fxLayout="row" fxLayoutAlign="space-between center">
  <mat-form-field>
    <input matInput type="text" (keyup)="apply($event)">
    <span matSuffix><mat-icon>search</mat-icon></span> <!-- alternative: cn-icon component-->
  </mat-form-field>
</div>
<div class="sofia-table-container">
  <table mat-table [dataSource]="dataSource">
  
    <!-- Column Definitions -->
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```

#### Cell Options
With Icon(s):
``` html
<ng-container matColumnDef="breed">
  <th mat-header-cell *matHeaderCellDef>Col Header</th>
  <td mat-cell *matCellDef="let row">
    <div class="sofia-cell-content">
      <div>{{row.data}}</div>
      <div class="sofia-actions">
        <!-- optional: add either one or two of the following icon components -->
        <mat-icon>task_alt</mat-icon>       <!-- alternative: cn-icon component-->
        <mat-icon>more_horiz</mat-icon>     <!-- alternative: cn-icon component-->
      </div>
    </div>
  </td>
</ng-container>
  ```
Description (only available in **sofia-table-tall** table):
``` html
<ng-container matColumnDef="breed">
  <th mat-header-cell *matHeaderCellDef>Col Header</th>
  <td mat-cell *matCellDef="let row">
    <div class="sofia-cell-content">
      <div>
        <div>{{row.data}}</div>
        <div class="sofia-description">{{row.description}}</div>
      </div>
      <!-- add actions here if necessary -->
    </div>
  </td>
</ng-container>
  ```


#### Footer (Lazy Loading Data)
Action Button:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>
<div class="sofia-table-container">
  <table mat-table [dataSource]="dataSource">
  
    <!-- Column Definitions -->
    
    <ng-container matColumnDef="loading">
      <td mat-footer-cell *matFooterCellDef [attr.colspan]="displayedColumns.length">
        <div class="sofia-loading-footer">
          <button *ngIf="!isLoadingResults" mat-button color="primary" (click)="fetch()">Load more</button>
          <mat-progress-spinner *ngIf="isLoadingResults" mode="indeterminate"></mat-progress-spinner>
          <div *ngIf="isLoadingResults">Loading</div>
        </div>
      </td>
    </ng-container>
    
    <!-- Row Definitions -->
    
    <tr mat-footer-row *matFooterRowDef="['loading']"></tr>
  </table>
</div>
  ```
Infinite Scrolling:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>

<!-- Important: add cdkScrollable directive and apply fixed height to table -->
<div class="sofia-table-container" cdkScrollable>
  <table mat-table [dataSource]="dataSource">
  
    <!-- Column Definitions -->
    
    <ng-container matColumnDef="loading">
      <td mat-footer-cell *matFooterCellDef [attr.colspan]="displayedDogColumns.length">
        <div class="sofia-loading-footer">
          <mat-progress-spinner *ngIf="isLoadingResults" mode="indeterminate"></mat-progress-spinner>
          <div>Loading</div>
        </div>
      </td>
    </ng-container>
    
    <!-- Row Definitions -->
    
    <tr mat-footer-row *matFooterRowDef="['loading']"></tr>
  </table>
</div>
  ```
``` typescript
isLoadingResults = false;
scrollSubscription: Subscription;

constructor(private _httpClient: HttpClient,
            private scrollDispatcher: ScrollDispatcher,
            private zone: NgZone) { }
              
ngAfterViewInit(): void {
// other setup code

this.scrollSubscription = this.scrollDispatcher
  .scrolled()
  .subscribe((data: CdkScrollable) => {
    if (data && data.measureScrollOffset("bottom") < 1)
      this.zone.run(() => this.fetch())
  })
}
```

#### Row Options
Selectable:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>
<div class="sofia-table-container">
  <table mat-table [dataSource]="dataSource">
  
    <ng-container matColumnDef="select">
      <th mat-header-cell *matHeaderCellDef>
        <mat-checkbox (change)="$event ? masterToggle() : null"
                      [checked]="selection.hasValue() && isAllSelected()"
                      [indeterminate]="selection.hasValue() && !isAllSelected()">
        </mat-checkbox>
      </th>
      <td mat-cell *matCellDef="let row">
        <mat-checkbox (click)="$event.stopPropagation()"
                      (change)="$event ? selection.toggle(row) : null"
                      [checked]="selection.isSelected(row)">
        </mat-checkbox>
      </td>
    </ng-container>
  
    <!-- Column Definitions -->
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```
``` typescript
displayedColumns: string[] = ['select', /* other column definitions */];
selection = new SelectionModel<Model>(true, []);

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.dataSource.data);
}
  ```

Sortable:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>
<div class="sofia-table-container">
<!-- Important: add matSort directive -->
  <table mat-table [dataSource]="dataSource" matSort>
  
    <ng-container matColumnDef="column">
      <!-- Important: add mat-sort-header directive -->
      <th mat-header-cell mat-sort-header *matHeaderCellDef>Col Header</th>
      <td mat-cell *matCellDef="let row">
        {{row.data}}
      </td>
    </ng-container>
    
    <!-- Column Definitions -->
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```
``` typescript
dataSource = new MatTableDataSource<Model>([]);
displayedColumns: string[] = ['column', /* other column definitions */];
@ViewChild(MatSort) sort: MatSort;

ngAfterViewInit(): void {
  
  // other setup code

  this.dataSource.sort = this.sort;

  // Setup custom sorting if necessary
  this.dataSource.sortingDataAccessor = (item, header) => {
    switch (header) {
      case 'specialCase': return item.special.subproperty;
      default: return item[header];
    }
  };
}
  ```

Expandable:
``` html
<div class="sofia-table-header" fxLayout="row" fxLayoutAlign="space-between">
  <h2>Data Table Title</h2>
</div>
<div class="sofia-table-container">
<!-- Important: add multiTemplateDataRows directive -->
  <table mat-table [dataSource]="dataSource" multiTemplateDataRows>
  
    <ng-container matColumnDef="expand">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let row">
        <mat-icon *ngIf="expandedElement !== row">expand_more</mat-icon>
        <mat-icon *ngIf="expandedElement === row">expand_less</mat-icon>
      </td>
    </ng-container>
        
    <!-- EXAMPLE FOR TWO LEVEL EXPANSION -->
    <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->
    <ng-container matColumnDef="expandedDetail">
      <td mat-cell *matCellDef="let element" [attr.colspan]="displayedColumns.length">
        <div class="sofia-element-detail"
             [@detailExpand]="element === expandedElement ? 'expanded' : 'collapsed'">
          <div *ngIf="!element.hasChildren">
            <img [src]="element.image"/>
          </div>
          
          <!-- Embedded Table -->
          <table *ngIf="element.hasChildren"
                mat-table [dataSource]="element.children"
                multiTemplateDataRows>

             <ng-container matColumnDef="expand">
                <td mat-cell *matCellDef="let rowSecondary">
                  <mat-icon *ngIf="expandedElementSecondary !== rowSecondary">expand_more</mat-icon>
                  <mat-icon *ngIf="expandedElementSecondary === rowSecondary">expand_less</mat-icon>
                </td>
              </ng-container>

              <ng-container matColumnDef="children">
                <td mat-cell *matCellDef="let rowSecondary">
                    {{rowSecondary.name}}
                </td>
              </ng-container>

              <!-- Expanded Content Column -->
              <ng-container matColumnDef="expandedDetailSecondary">
                <td mat-cell *matCellDef="let rowSecondary" [attr.colspan]="secondaryDisplayedColumns.length">
                  <div class="sofia-element-detail"
                       [@detailExpand]="rowSecondary === expandedElementSecondary ? 'expanded' : 'collapsed'">
                    <div>
                      <img [src]="rowSecondary.image"/>
                    </div>
                  </div>
                </td>
              </ng-container>

              <tr mat-row *matRowDef="let rowSecondary; columns: secondaryDisplayedColumns;"
                  class="sofia-element-row"
                  [class.sofia-expanded-row]="expandedElementSecondary === rowSecondary"
                  (click)="expandSecondary(element, rowSecondary)">
              </tr>
              <tr mat-row class="sofia-detail-row" *matRowDef="let rowSecondary; columns: ['expandedDetailSecondary']"></tr>
            </table>
        </div>
      </td>
    </ng-container>
    
    <!-- Column Definitions -->
    
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"
        class="sofia-element-row"
        [class.sofia-expanded-row]="expandedElement === row"
        (click)="expandPrimary(row)">
    </tr>
    <tr mat-row class="sofia-detail-row" *matRowDef="let row; columns: ['expandedDetail']"></tr>
    
    <!-- Row Definitions -->
    
  </table>
</div>
  ```
``` typescript
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TableComponent implements AfterViewInit {

  displayedColumns: string[] = ['expand', /* other column definitions */];
  expandedElement: Model | null;
  expandedElementSecondary: Model | null;
  
  // embedded table column definitions
  secondaryDisplayedColumns: string[] = ['expand', /* other column definitions */];

  expandPrimary(row) {
    if (this.expandedElement === row) {
      this.expandedElement = null;
    } else {
      this.expandedElement = row;
    }
  }

  // second level expansion
  expandSecondary(row, subrow) {
    if (this.expandedElementSecondary === subrow) {
      this.expandedElementSecondary = null;
    } else {
      this.expandedElementSecondary = subrow;
    }
  }
}
  ```
