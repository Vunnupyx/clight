﻿# Layout

A grid layout, as well as Angular Flex Layout is available through this theme. These features include the CELOS Next screen breakpoints explained below.

The parent element of the view has to contain the class `grid-layout`, which will automatically create the grid within this element.

## Custom classes

| Name            | Description                                                                                                                                                                   |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| grid-layout     | Applied to the parent container creating the grid layout within the container                                                                                                 |
| col-*n*         | Applied to a child element, assigning the element a width of n columns.</br> *n* is the number of columns the element is supposed to allocate, e.g. col-2 allocates 2 columns.  | 
| col-*size*-*n*  | Applied to a child element, assigning the element a width of n columns in the range of the applied size.</br> *n* is the number of columns the element is supposed to allocate and *size* is the breakpoint range in which the columns are applied, e.g. col-sm-2 allocates 2 columns in the range of a small screen.  | 

## Breakpoints

| Key   | Range              | Number of Columns  |
|-------|--------------------|--------------------|
| xxs   | <= 479px           | 2                  |
| xs    | 480px - 575px      | 3                  |
| sm    | 576px - 767px      | 4                  |
| md    | 768px - 991px      | 6                  |
| lg    | 992px - 1280px     | 8                  |
| xl    | 1281px - 1919px    | 12                 |
| xxl   | >= 1920px          | 12                 |

## Directives

- Angular Flex Layout custom directives:
  - fxShow
  - fxHide
  - ngClass
  - ngStyle
  - imgSrc
  - fxFlex
  - fxFlexOrder
  - fxFlexOffset
  - fxFlexAlign
  - fxFlexFill / fxFill
  - fxFlexLayout

## Additional Breakpoints for Flex Layout

For the Angular Flex Layout Directives another set of breakpoints can be applied (e.g. ngClass.lt-md="my-class"), which are listed below.

| Key     | Range              | Description                              |
|---------|--------------------|------------------------------------------|
| lt-xs   | <= 575px           | Less than or equal to xs screen size     |
| gt-xs   | >= 480px           | Greater than or equal to xs screen size  |
| lt-sm   | <= 767px           | Less than or equal to sm screen size     |
| gt-sm   | >= 576px           | Greater than or equal to sm screen size  |
| lt-md   | <= 991px           | Less than or equal to md screen size     |
| gt-md   | >= 768px           | Greater than or equal to md screen size  |
| lt-lg   | <= 1280px          | Less than or equal to lg screen size     |
| gt-lg   | >= 992px           | Greater than or equal to lg screen size  |
| lt-xl   | <= 1919px          | Less than or equal to xl screen size     |
| gt-xl   | >= 1281px          | Greater than or equal to xl screen size  |

## Example

````html
<div class="layout-grid">
  <div class="col-xxl-6 col-xl-6 col-lg-4 col-md-3 col-sm-2 col-xs-2 col-xxs-1">
    I allocate half the screen for all screen sizes (except on small screens I allocate 1/3rd)
  </div>
  <div class="col-1">
    I allocate one column on all screens
  </div>
  <div fxHide.lt-xs="true">
    I am not shown on xs and xxs screens
  </div>
</div>
````