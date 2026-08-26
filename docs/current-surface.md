# Current surface

Status: validated personal-use pilot with CUBE Phase 1 namespace/layer/Block migration implemented locally. See [`ADR-010`](../decisions/ADR-010-cube-migration-contract.md) and the [`Phase 1 migration evidence`](cube-phase1-migration.md).

## Entries and selectors

- Foundations: semantic token roles and generated custom properties; fixture-owned values are not distributed as a theme.
- Surface Block: opt-in `data-nbr-level="quiet|outlined|raised"` levels, with borders, semantic colors, hard shadows, and forced-colors fallback.
- Button: native `button` and button-like `a` styling for hover, active, focus-visible, disabled/`aria-disabled`, busy, reduced motion, forced colors, logical RTL shadow direction, and a fixed-direction escape hatch.
- Field: a wrapper plus label/description/error styling and text-like `input`, `textarea`, and `select` geometry, focus, disabled, invalid, adjacent-error, and forced-colors rules. The evidenced field is a labeled email `input`; other controls are not equivalently validated.
- Aggregate Blocks: `src/blocks/index.css` combines the Block entries and predeclares exactly `nbr.tokens, nbr.compositions, nbr.utilities, nbr.blocks, nbr.exceptions`. Standalone source entries are available for Surface, Button, and Field.

The fixture and runtime surface uses the stable `nbr` names. This repository remains private and unpublished; no adopter migration is authorized by this Phase 1 change.

## Themes, direction, and layers

Five fixture mappings (light, dark, workshop, nested, and neutralized) demonstrate token separation and nested direction behavior. Palette, typography, fonts, content, motifs, and theme state remain product-owned. The automated shadow matrix covers LTR, RTL, nested direction, fixed direction, and shadow removal; borders and focus/invalid/disabled cues remain when shadows are removed.

Tokens emit `@layer nbr.tokens`; aggregate Blocks predeclare the complete ordered five-layer contract. Compositions and Utilities are reserved and empty in Phase 1. Unlayered consumer CSS or a later consumer layer wins. The Blocks intentionally avoid resets, IDs, broad `!important`, and hostile specificity.

## Semantic responsibilities

Neobrui is CSS-only. Native HTML and the consuming application own roles, accessible names, keyboard behavior, link navigation, form validation, disabled behavior, announcements, routing, and state changes. CSS does not make a link disabled, submit a form, or announce an error. Applications must provide the expected label/description/error relationships and state attributes.

## Integrations and exclusions

Plain CSS, CSS Modules, Astro, and Tailwind coexistence are proven by isolated fixtures. These are integration evidence, not adapters, plugins, or blanket support for every configuration. There is no runtime JavaScript, reset, bundled identity, implemented layout primitive, implemented Utility, checkbox/radio block, implemented DTCG contract, public package, registry distribution, or publication promise. ADR-010 specifies the future Stack/Cluster, Utility, DTCG, and release contracts without claiming they exist.

## Evidence and misuse

The historical pre-migration viability assessment is in `evidence/historical/personal-use-viability-and-expansion.md`; current behavior is governed by ADR-010 and the current source/tests. Other historical evidence includes the [`Spike 2 recipe evidence`](../evidence/historical/spike-2-recipes.md), `evidence/historical/spike-3-shadows.md`, `evidence/historical/spike-4-coexistence.md`, `evidence/historical/spike-5-size-package.md`, and `evidence/historical/spike-6-qa-rehearsal.md`. Automated Chromium/Firefox/WebKit checks validate the fixtures; manual accessibility, hardware, OS forced-colors, and true browser-UI zoom procedures remain documented but unexecuted without a dated run record. Do not infer support for untested markup, configurations, assistive technologies, devices, or future browser versions.
