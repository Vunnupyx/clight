# Spacings

Additionally, custom class definitions are provided in order to apply margins to every element or container in a standardized way. 

The key defined in the table below each define a specific spacing, which can be applied using the classes in the second table.

| Key     | Spacing |
|---------|---------|
| xxs     | 4px     |
| xs      | 8px     |
| s       | 16px    |
| m       | 24px    |
| l       | 48px    |
| xl      | 96px    |


The *key* property refers to the table above and applies the spacing value to the style of the object according to the class types defined below.


| Class                 | Description                                                 |
|-----------------------|-------------------------------------------------------------|
| spacing-*key*         | Applies margin on all four sides (top, right, bottom, left) |
| spacing-x-*key*       | Applies margin on the x-axis (right, left)                  |
| spacing-y-*key*       | Applies margin on the y-axis (top, bottom)                  |
| spacing-top-*key*     | Applies margin on top of the element                        |
| spacing-right-*key*   | Applies margin on the right of the element                  |
| spacing-bottom-*key*  | Applies margin on the bottom of the element                 |
| spacing-left-*key*    | Applies margin on the left of the element                   |

## Code Example 

`<div class="spacing-x-s spacing-bottom-l spacing-top-xs">I have a 16px margin on the left and right, as well as a 48px margin on the bottom and an 8px margin on the top</div>`
