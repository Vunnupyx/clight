# Scrollbar

A Scrollbar default look and feel is enabled by the theme. The styling is applied automatically, but can easily be removed if necessary.

## Custom classes

| Name               | Description                                                                                                 |
|--------------------|-------------------------------------------------------------------------------------------------------------|
| no-celos-scrollbar | Applied to the <html> tag in order to remove the celos scrollbar from all views.                            |
| celos-scrollbar    | In combination with the class `no-celos-scrollbar` can apply the celos scrollbar to selected elements only. |

## Example

#### Remove scrollbar styles from the application:

_index.html_
````html
<html class="no-celos-scrollbar">
    ...
</html>
````

#### Remove scrollbar styles from the application, but apply it on specific components:

_index.html_
````html
<html class="no-celos-scrollbar">
    ...
</html>
````

_example.component.html_
````html
<div class="celos-scrollbar">
    content
</div>
````
