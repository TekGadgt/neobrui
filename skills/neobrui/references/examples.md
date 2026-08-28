# Examples reference

Use native semantics first and scope product identity. These examples are intentionally complete enough to paste into a fixture.

```html
<main class="nbr-wrapper nbr-stack">
  <h1>Review queue</h1>
  <article class="nbr-surface" data-nbr-level="raised">
    <h2>Lead item</h2><p>Important content.</p>
    <a class="nbr-pressable" href="/details">Open details</a>
  </article>
</main>
```

```css
[data-product="coral-ledger"] {
  --nbr-color-action: #e85d3f;
  --nbr-color-on-action: #201814;
  --nbr-color-border: #201814;
  --nbr-color-shadow: #201814;
}
```

Bad: `<div class="nbr-pressable" onclick="save()">Save</div>` (no native semantics); a shadow-only focus treatment; a global reset bundled with an opt-in class; or leaving equivalent product CSS in place and claiming the primitive owns it.
