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

Automated browser evidence is recorded by `tests/recipes.spec.js`: native roles/names and tab order, stable button geometry during press, quiet ratio, fixture theme-boundary remapping of consumed hooks (`--_nb-surface-background`, `--_nb-button-background`, `--_nb-field-background`, and `--_nb-color-border`), 320px overflow, 200% text-size reflow preflight, reduced-motion active-cue behavior, forced-colors shadow suppression/state cues, and JS-disabled route loading. Axe is dev-only and has no runtime dependency.

## Accessibility limitations

Static automated checks do not replace keyboard-only hardware traversal, screen-reader announcement testing, touch target review, physical forced-colors, or human visual review at true browser 200% zoom. The executable 200% check enlarges root text and is a reflow preflight, not equivalent to browser zoom; true browser zoom remains a residual manual check.

## Shadow deferral

Raised Surface and Button used only block-axis (`x=0`) shadow tokens as a temporary Spike 2 baseline. Spike 3 replaces that baseline; see `evidence/spike-3-shadows.md` and `decisions/ADR-004-rtl-shadow.md`.

## Stop/narrow assessment

Stop at Surface/Button/Field. No additional recipe or public API is authorized by this spike. Kill/narrow if native semantics are replaced by CSS, state relies on color/shadow alone, or the temporary hooks begin to be treated as stable names.
