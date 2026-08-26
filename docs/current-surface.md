# Current surface

Status: validated personal-use pilot. This is the supported shape of the evidence today, not a public API promise.

## Entries and selectors

- Foundations: semantic token roles and generated custom properties; fixture-owned values are not distributed as a theme.
- Surface: opt-in `data-_nb-level="quiet|outlined|raised"` levels, with borders, semantic colors, hard shadows, and forced-colors fallback.
- Button: native `button` and button-like `a` styling for hover, active, focus-visible, disabled/`aria-disabled`, busy, reduced motion, forced colors, logical RTL shadow direction, and a fixed-direction escape hatch.
- Field: a wrapper plus label/description/error styling and text-like `input`, `textarea`, and `select` geometry, focus, disabled, invalid, adjacent-error, and forced-colors rules. The evidenced field is a labeled email `input`; other controls are not equivalently validated.
- Aggregate: `src/recipes/index.css` combines the recipe entries and cascade-layer declarations. Standalone source entries are available for Surface, Button, and Field.

All current class, data-attribute, custom-property, and layer names are temporary `_nb-spike` evidence. Do not expose them to another project until Ryan selects a stable namespace.

## Themes, direction, and layers

Five fixture mappings (light, dark, workshop, nested, and neutralized) demonstrate token separation and nested direction behavior. Palette, typography, fonts, content, motifs, and theme state remain product-owned. The automated shadow matrix covers LTR, RTL, nested direction, fixed direction, and shadow removal; borders and focus/invalid/disabled cues remain when shadows are removed.

Tokens emit `@layer neobrui.tokens`; aggregate recipes declare `neobrui.tokens, neobrui.recipes`. Unlayered consumer CSS or a later consumer layer wins. The recipes intentionally avoid resets, IDs, broad `!important`, and hostile specificity.

## Semantic responsibilities

Neobrui is CSS-only. Native HTML and the consuming application own roles, accessible names, keyboard behavior, link navigation, form validation, disabled behavior, announcements, routing, and state changes. CSS does not make a link disabled, submit a form, or announce an error. Applications must provide the expected label/description/error relationships and state attributes.

## Integrations and exclusions

Plain CSS, CSS Modules, Astro, and Tailwind coexistence are proven by isolated fixtures. These are integration evidence, not adapters, plugins, or blanket support for every configuration. There is no runtime JavaScript, reset, bundled identity, layout primitive, checkbox/radio recipe, DTCG contract, public package, registry distribution, or publication promise.

## Evidence and misuse

The canonical evidence is in `docs/personal-use-viability-and-expansion.md`, `evidence/spike-2-recipes.md`, `evidence/spike-3-shadows.md`, `evidence/spike-4-coexistence.md`, `evidence/spike-5-size-package.md`, `evidence/spike-6-qa-rehearsal.md`, and `size-report.json`. Automated Chromium/Firefox/WebKit checks validate the fixtures; manual accessibility, hardware, OS forced-colors, and true browser-UI zoom procedures are documented but unexecuted without a dated run record. Do not infer support for untested markup, configurations, assistive technologies, devices, or future browser versions.
