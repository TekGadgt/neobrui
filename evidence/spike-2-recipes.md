# Spike 2 recipe evidence

## Contract and RED→GREEN

- RED: recipe fixture and route assertions were specified before implementation; the prior fixture had no `_nb-spike-surface`, `_nb-spike-button`, or `_nb-spike-field` hooks.
- GREEN: `/recipes/` serves the three separate imported recipe entries with native button/link/label/input markup, documented override, and misuse boundaries.

## State matrix

| Recipe | Required evidence |
|---|---|
| Surface | quiet/rule-only, outlined, raised/tactile; 2 of 3 fixture surfaces quiet or lower-noise |
| Button | native button/link, hover, active, focus-visible, disabled button, busy status, reduced motion, forced colors |
| Field | label, description, required, focus, disabled, `aria-invalid=true`, `aria-describedby`, dashed/text invalid cue, forced colors |

## Measurements

Automated browser evidence is recorded by `tests/recipes.spec.js`: native roles/names and tab order, stable button geometry during press, quiet ratio, custom-property override, 320px overflow, reduced-motion and JS-disabled route loading. Axe is dev-only and has no runtime dependency.

## Accessibility limitations

Static automated checks do not replace keyboard-only hardware traversal, screen-reader announcement testing, touch target review, physical forced-colors, or human visual review at true 200% zoom.

## Stop/narrow assessment

Stop at Surface/Button/Field. No additional recipe or public API is authorized by this spike. Kill/narrow if native semantics are replaced by CSS, state relies on color/shadow alone, or the temporary hooks begin to be treated as stable names.
