# Current surface

Status: validated `0.1.0-alpha.0` personal-alpha pilot with the CUBE Phase 4 package and local release artifact implemented. See [`ADR-010`](../decisions/ADR-010-cube-migration-contract.md) and the [`local release workflow`](local-release-workflow.md).

## Entries and selectors

- Foundations: semantic token roles and generated custom properties; fixture-owned values are not distributed as a theme.
- Surface Block: opt-in `data-nbr-level="quiet|outlined|raised"` levels, with borders, semantic colors, hard shadows, and forced-colors fallback.
- Button: native `button` and button-like `a` styling for hover, active, focus-visible, disabled/`aria-disabled`, busy, reduced motion, forced colors, logical RTL shadow direction, and a fixed-direction escape hatch.
- Field: a wrapper plus label/description/error styling and text-like `input`, `textarea`, and `select` geometry, focus, disabled, invalid, adjacent-error, and forced-colors rules. The evidenced field is a labeled email `input`; other controls are not equivalently validated.
- Stack Composition: `.nbr-stack` nested-safe vertical flex flow with semantic `space-4` default and documented `--nbr-stack-gap` hook; margins remain consumer-owned.
- Cluster Composition: `.nbr-cluster` wrapping flex row with semantic `space-3` default and bounded gap/alignment/justification hooks using logical, direction-safe behavior.
- Utilities: `.nbr-u-visually-hidden` (non-focusable accessible hiding, no MVP focus reveal) and `.nbr-u-wrapper` (centered content measure with bounded logical padding/size hooks).
- Neutral executable evidence route: `/neutral-site/`, CSS-only, no runtime JavaScript or external requests.

The fixture and runtime surface uses the stable `nbr` names. This repository remains private and unpublished; no HTML Day or personal-site adopter migration is authorized. Further Blocks and adopter work remain deferred.

## Themes, direction, and layers

Five fixture mappings (light, dark, workshop, nested, and neutralized) demonstrate token separation and nested direction behavior. Palette, typography, fonts, content, motifs, and theme state remain product-owned. The automated shadow matrix covers LTR, RTL, nested direction, fixed direction, and shadow removal; borders and focus/invalid/disabled cues remain when shadows are removed.

Tokens emit `@layer nbr.tokens`; the aggregate entry predeclares the complete ordered five-layer contract and imports Compositions, Utilities, then Blocks. Standalone entries own only their concern. Utilities cannot override Block state because `nbr.utilities` precedes `nbr.blocks`; unlayered consumer CSS or a later consumer layer wins. The Blocks intentionally avoid resets, IDs, broad `!important`, and hostile specificity.

## Semantic responsibilities

Neobrui is CSS-only. Native HTML and the consuming application own roles, accessible names, keyboard behavior, link navigation, form validation, disabled behavior, announcements, routing, and state changes. CSS does not make a link disabled, submit a form, or announce an error. Applications must provide the expected label/description/error relationships and state attributes.

## Integrations and exclusions

Plain CSS, CSS Modules, Astro, Tailwind, and the neutral-site route are proven by isolated fixtures. These are integration evidence, not adapters, plugins, or blanket support for every configuration. There is no runtime JavaScript, reset, bundled identity, generated utility matrix, checkbox/radio block, public package, registry distribution, or publication promise. DTCG remains build-time only and is not runtime-loaded.

## Evidence and misuse

The historical pre-migration viability assessment is in `evidence/historical/personal-use-viability-and-expansion.md`; current behavior is governed by ADR-010 and the current source/tests. Other historical evidence includes the [`Spike 2 recipe evidence`](../evidence/historical/spike-2-recipes.md), `evidence/historical/spike-3-shadows.md`, `evidence/historical/spike-4-coexistence.md`, `evidence/historical/spike-5-size-package.md`, and `evidence/historical/spike-6-qa-rehearsal.md`. Automated Chromium/Firefox/WebKit checks validate the fixtures; manual accessibility, hardware, OS forced-colors, and true browser-UI zoom procedures remain documented but unexecuted without a dated run record. Do not infer support for untested markup, configurations, assistive technologies, devices, or future browser versions.
