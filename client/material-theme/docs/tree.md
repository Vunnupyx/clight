# Tree Component

The DMG Mori Theme will be applied on top of the default Angular Material Component ([documentation here](https://material.angular.io/components/tree/overview)).

## Development Guidelines

No custom rules are applied to the tree component.

## Code Examples

``` html
<mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
    <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
      <button mat-icon-button disabled></button>
      {{node.name}}
    </mat-tree-node>
    <mat-tree-node *matTreeNodeDef="let node;when: hasChild" matTreeNodePadding>
      <button mat-icon-button matTreeNodeToggle
              [attr.aria-label]="'Toggle ' + node.name">
        <mat-icon class="mat-icon-rtl-mirror">
          {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
        </mat-icon>
      </button>
      {{node.name}}
    </mat-tree-node>
</mat-tree>
```
