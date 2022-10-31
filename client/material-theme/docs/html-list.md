# HTML List

The DMG MORI Theme will be applied on top of the default HTML List Component.

## Development Guidelines

### Custom Rules

The following custom class is enabled by the theme:

| Class name    | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| list-headline | Applied to a div element before the list to apply headline stylings |

## Code Examples

Unordered List:

```html
<div class="sofia-list">
  <div class="list-headline">Unordered List Headline</div>
  <ul>
    <li>Unordered List level 1</li>
    <li>Unordered List level 1</li>
    <ul>
      <li>Unordered List level 2</li>
      <li>Unordered List level 2</li>
    </ul>
  </ul>
</div>
```

Ordered List:

```html
<div class="sofia-list">
  <div class="list-headline">Ordered List Headline</div>
  <ol type="1">
    <li>Ordered List level 1</li>
    <li>Ordered List level 1</li>
    <ol type="a">
      <li>Ordered List level 2</li>
      <li>Ordered List level 2</li>
    </ol>
  </ol>
</div>
```
