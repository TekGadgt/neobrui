# ADR-003: Disposable Spike 2 recipe contract

Status: accepted for Spike 2 evidence only. This is disposable evidence, not public stability.

## Decision

Prove exactly three reset-free, opt-in global CSS recipes under the temporary `_nb-spike-` prefix: Surface (`data-_nb-level=quiet|outlined|raised`), Button, and Field. `src/recipes/index.css` is a private aggregate entry. CSS custom properties are the only documented styling hooks; no raw per-instance palette or spacing API is introduced.

Native semantic HTML owns accessible names, keyboard behavior, form validation, link navigation, disabled behavior, and event/state logic. Recipes own presentation, focus-visible, non-color state cues, forced-colors resilience, and reduced-motion treatment. Applications own content, semantics, state decisions, palette/type/motifs, and any unsupported behavior.

Spike 2 recorded the raised Surface and Button shadows as a temporary block-axis-only baseline (`x=0`). Spike 3 supersedes that visual detail with nonzero horizontal offset, logical RTL mirroring, nested direction, a fixed physical escape hatch, and matching press translation. This accepted deferral was not a Spike 2 kill signal.

## Boundaries

This does not authorize additional recipes, runtime JavaScript, components, custom elements, adapters, package/API names, DTCG artifacts, icons, fonts, assets, deployment, or publishing. Generic containers remain non-interactive. A link is never visually or semantically disabled by this CSS.

## Removal signal

Delete this evidence when the recipe rubric is rejected or when a future design system replaces the temporary prefix. Nothing here is a compatibility promise.
