# HTML Link

The DMG Mori Theme will be applied on top of the default HTML Link (`<a>`) Component if the following class `sofia-link` is applied:

## Development Guidelines

### Custom Rules

The following custom class is enabled by the theme:

| Class name | Description                                                           |
|------------|-----------------------------------------------------------------------|
| disabled   | Disables all pointer-events on the link and applies disabled styling. |

## Code Examples
Link:
``` html
<a class="sofia-link" href="/sassdoc/index.html">
  This is a link to the SCSS Variables
</a>
```

Inline Link:
``` html
<p>
  Inline <a class="sofia-link" href="/sassdoc/index.html">link</a> to the SCSS Variables.
</p>
```

Disabled Link:
``` html
<a class="sofia-link disabled" href="/sassdoc/index.html">
  This is a disabled link
</a>
```
