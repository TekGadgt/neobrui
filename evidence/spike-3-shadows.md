# Spike 3 shadow evidence

## RED to GREEN

- RED: `tests/recipes.spec.js` added a nonzero inline-offset assertion against the accepted Spike 2 baseline; Chromium reported `rgb(23, 21, 18) 0px 4px 0px 0px`. `tests/token-schema.test.mjs` also rejected the old full-shadow role only after the new validation was introduced.
- GREEN: axis-length roles generate one diagonal shadow. Focused shadow policy checks pass after the recipe and dedicated fixture were added.

## Fixture and token contract

`/shadows/` contains LTR and RTL logical defaults, nested LTR-in-RTL and RTL-in-LTR cases, fixed physical subtrees in both directions, rest/active controls, and a shadow-disabled state matrix. `fixtures/inputs.mjs` owns the temporary axis lengths; core does not regain project values. The temporary internal schema contract allows only `0` or finite decimal values with `px`, `rem`, `em`, `ch`, `ex`, `vw`, `vh`, `vmin`, and `vmax`. It rejects `%`, physical units, functions, colors, multi-token strings, and NaN/infinite-like text before CSS generation; this is not public API stability. The generated CSS is deterministic and emits `--_nb-shadow-inline: 3px`, `--_nb-shadow-block: 4px`, `--_nb-shadow-pressInline: 1px`, and `--_nb-shadow-pressBlock: 1px`.

## Automated checks

`tests/shadows.spec.js` covers nonzero positive LTR offsets, mirrored RTL inline offsets with positive block offset, nearest nested direction, fixed down-right escape hatch, active translation and stable dimensions/no overflow, keyboard focus at 320px with 200% text-size reflow, shadow-disabled/forced-colors cues, no external requests, and axe. The screenshot test captures compact evidence at 640x480 for each configured Playwright engine under `evidence/screenshots/`. Exact engine names are in each filename.

The active contract is one `box-shadow` layer with zero blur. Rest is `(inline, block) = (3px, 4px)` in LTR and `(-3px, 4px)` in RTL. Pressed remaining shadow is `(1px, 1px)` or `(-1px, 1px)` and the LTR translation delta is `(2px, 3px)`.

## Accessibility and fallback

Shadow direction is art direction, not semantics or accessibility. Border, focus, active, disabled, invalid, and forced-colors cues do not depend on shadow. Nested direction passed the one bounded revision; fixed-only fallback was not activated. Residual manual checks are true browser zoom at 200%, keyboard-only hardware traversal, screen-reader announcements, touch targets, physical forced-colors, and human visual review.
