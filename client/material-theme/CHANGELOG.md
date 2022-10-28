# DMG MORI Material theme changelog

## Version 13.9.0

Support for Angular version 11 removed
Scrollbar styling applied to <html> instead of <body>
Modules added to example app
Removed Accordion and Standard Page from Example App
Removed Stepper Stylings

The following components were adjusted according to Design:

- Input Fields
- Button
- Toggle Button Group
- Chips
- Selection Controls:
  - Radio Group
  - Checkbox
  - Slide Toggle
- Table
- Snackbar

The following components were added:

- Progress Spinner
- Progress Bar
- HTML List
- HTML Link

The following features were added:

- Design Token through Sass-Modules
- Hover Controller
- Japanese Font Files
- Sassdoc view in example app

## Version 11.8.2, 12.8.2, 13.8.2

Dialog padding bugfix

## Version 11.8.1, 12.8.1, 13.8.1

Scrollbar styling was adjusted

## Version 11.8.0, 12.8.0, 13.8.0

Default scrollbar styling added

The following components were adjusted according to Design:

- Fixed select, multiselect and textarea input field Placeholder size
- Added celos-grid-layout class to the grid-layout

## Version 11.7.8, 12.7.8, 13.7.8

Fixed fxLayout directive issues and small example app bugs

## Version 11.7.6, 12.7.6, 13.7.6

Fixed Column class bugs

## Version 11.7.5, 12.7.5, 13.7.5

Fixed DMG MORI Header Bug

## Version 11.7.4, 12.7.4, 13.7.4

The following components were adjusted according to Design:

- Chips Design adjusted

Support for Angular Version 12 and 13 added

## Version 11.7.3

Hotfix:

- padding from body was removed

## Version 11.7.2

The following components were adjusted according to Design:

- Multiselect input Design fixed
- Example app published
- Default Page Header Component added (dmg-header)
- Floating Select Input Field added

## Version 11.6.2

The following components were adjusted according to Design:

- Large Toggle Button added
- Disabled Selected Radio Button fixed
- Extended Fab Button size adjusted
- Breakpoints adjusted

## Version 11.6.1

The following components were adjusted according to Design:

- Toggle Button Group Design changed
- Button colors not bound to focus anymore
- Chips margins adjusted
- Card Border Radius added
- Select Input options panel position changed
- Chips design in selected state is fixed

Also, the structure of the theme has been changed in order to support the usage of variables inside of the theme.

## Version 11.5.0

The following components were adjusted according to Design:

- Button elevation adjusted (primary and secondary buttons have a different elevation)
- Flat buttons enabled
- Warning card border changed from 1px to 2px
- Card with grey background introduced
- Card with dashed border with both 1px and 2px strength introduced
- Default elevation of cards changed to none
- Number indication added to chips

## Version 11.4.2

The following components were adjusted according to Design:

- Cards were extended by border color classes
- Fab Buttons were adjusted to mat-button design
- Grid-column was extended by fixed column width

## Version 11.4.0

The following components were adjusted according to Design:

- Accordion theme has been removed
- Drag&Drop background color for chips has been fixed in order to only apply to the chips components
- Chips sizing and color adjustments
- Input field background color has been changed
- Tabs min width has been removed
- Snackbar colors has been adjusted
- Custom elevation classes have been added to the card component

The following color variables have been added:

- status colors changed
- data visualization colors added

Also, the structure of the files within the theme was changed. Therefore, scss variables are now available within the apps.

## Version 11.3.0

The following components were adjusted according to Design:

- Accordion
- Buttons
- Chips
- Selection Controls
  - Checkbox
  - Radio Button
  - Slide Toggle
- Tree

Spacing classes were introduced as defined below:

| Key | Spacing |
| --- | ------- |
| xxs | 4px     |
| xs  | 8px     |
| s   | 16px    |
| m   | 24px    |
| l   | 48px    |
| xl  | 96px    |

The _key_ property refers to the table above and applies the spacing value to the style of the object according to the class types defined below.

| Class                | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| spacing-_key_        | Applies margin on all four sides (top, right, bottom, left) |
| spacing-x-_key_      | Applies margin on the x-axis (right, left)                  |
| spacing-y-_key_      | Applies margin on the y-axis (top, bottom)                  |
| spacing-top-_key_    | Applies margin on top of the element                        |
| spacing-right-_key_  | Applies margin on the right of the element                  |
| spacing-bottom-_key_ | Applies margin on the bottom of the element                 |
| spacing-left-_key_   | Applies margin on the left of the element                   |

## Version 11.2.2

- DMG MORI Grid Layout added with custom css classes

| Name           | Description                                                                                                                                                                                                                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| grid-layout    | Applied to the parent container creating the grid layout within the container                                                                                                                                                                                                                                         |
| col-_n_        | Applied to a child element, assigning the element a width of n columns.</br> _n_ is the number of columns the element is supposed to allocate, e.g. col-2 allocates 2 columns.                                                                                                                                        |
| col-_size_-_n_ | Applied to a child element, assigning the element a width of n columns in the range of the applied size.</br> _n_ is the number of columns the element is supposed to allocate and _size_ is the breakpoint range in which the columns are applied, e.g. col-sm-2 allocates 2 columns in the range of a small screen. |

- DMG MORI custom Breakpoints declared

| Key | Range           | Number of Columns |
| --- | --------------- | ----------------- |
| xxs | <= 479px        | 2                 |
| xs  | 480px - 575px   | 3                 |
| sm  | 576px - 767px   | 4                 |
| md  | 768px - 991px   | 6                 |
| lg  | 992px - 1280px  | 8                 |
| xl  | 1281px - 1919px | 12                |
| xxl | >= 1920px       | 12                |

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

## Version 11.1.5

- Updated README and CHANGELOG
- Adjusted package dependencies

## Version 11.1.4

Fixed issues in build process

## Version 11.1.2

Changed internal structure of the repository

## Version 11.1.1

- Adjusted the tab size to design requirements
- Removed Badge theming
- Adjusted Stepper styling to design requirements

## Version 11.1.0

- First Release of DMG MORI Angular Material Theme
- Contains the following elements:
  - Toggle Button
  - Toggle Button Group
  - Badges
  - Button
  - Card
  - Checkbox
  - Chips
  - Datepicker
  - Dialog
  - Expansion Panel
  - Input
  - Paginator
  - Radio Button
  - Select
  - Slide Toggle
  - Snackbar
  - Stepper
  - Table
  - Tabs
  - Tree
