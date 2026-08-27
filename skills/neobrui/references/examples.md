# Examples and anti-examples

Good:

```html
<button class="nbr-pressable" type="button">Save</button>
<article class="nbr-surface" data-nbr-level="raised">Content</article>
```

Bad:

```html
<div class="nbr-pressable" onclick="save()">Save</div>
<button class="nbr-button nbr-shadow-lg">Save</button>
```

The good example keeps native semantics and uses only the public API. The bad example invents a legacy alias and broad utility, or replaces button behavior with a non-semantic element.
