# Getting started for personal use

This repository is the local, private `0.1.0-alpha.0` CUBE Phase 4 personal-alpha release. Its stable current namespace is `nbr`, with Compositions under `src/compositions`, Utilities under `src/utilities`, and a deterministic package/archive contract. Use a local checkout or the explicitly generated private archive only; do not resolve it from a registry or publish it.

## Local verification path

```sh
pnpm install --frozen-lockfile
pnpm validate:tokens
pnpm build
pnpm test
pnpm verify:size
```

Verify the generated archive from repository root with `(cd dist/release && sha256sum -c SHA256SUMS)`.

The committed `size-report.json` is initial design evidence. `pnpm verify:size` is an optional, explicit fresh non-mutating size-evidence check, not required for browser, CI, or build verification; use `pnpm measure:size` intentionally when changing or expanding the package surface. `pnpm verify:clean` is the canonical full clean-tree path for fixture, browser, release-integrity, and teardown checks. Keep the three configured Playwright projects (Chromium, Firefox, WebKit).

## Define tokens and a theme

The validated authoring path is a JavaScript token map checked by `src/tokens/schema.mjs` and emitted by `src/tokens/tokens.mjs`. Copy the shape from `fixtures/inputs.mjs`, supply every required semantic role, and keep palette aliases, fonts, content, and motifs in the consuming project. DTCG 2025.10 export/import is bounded and build-time only; generated JSON is not a second source.

## Consume CSS

The current Phase 4 names below are the stable local contract. Product themes and `data-theme` state remain product-owned; Neobrui supplies semantic tokens and opt-in Blocks only.

Plain CSS:

```html
<link rel="stylesheet" href="./generated-tokens.css">
<link rel="stylesheet" href="./blocks.css">
<section data-nbr-level="raised">...</section>
<button class="nbr-button">Save</button>
```

Astro: import the aggregate CSS once from the application entry/layout, keep Astro scoped styles for local composition, and preserve native HTML semantics.

CSS Modules: import the global block entry separately; use module classes for local composition and do not assume a hashed module class is a Neobrui selector.

Tailwind: treat generated tokens/blocks as application-owned CSS input. Tailwind preflight and utility order remain consumer-owned; the fixture proves coexistence, not universal Tailwind support.

The current contract includes `.nbr-stack` and `.nbr-cluster` Compositions plus `.nbr-u-visually-hidden` and `.nbr-u-wrapper` Utilities. Stack defaults to `var(--nbr-space-4)` through `--nbr-stack-gap`; Cluster defaults to `var(--nbr-space-3)` and exposes only `--nbr-cluster-gap`, `--nbr-cluster-align`, and `--nbr-cluster-justify`. Wrapper uses `--nbr-size-content` and `--nbr-space-4`, with bounded `--nbr-wrapper-max-inline-size` and `--nbr-wrapper-padding-inline` hooks. Visually hidden is non-focusable content only; authors provide a product-owned reveal/skip-link pattern when focus visibility is needed.

Standalone versus aggregate: use the aggregate entry when all approved Compositions, Utilities, and Blocks are needed; use `src/compositions/{stack,cluster}.css` or `src/utilities/{visually-hidden,wrapper}.css` for narrower graphs. The neutral executable evidence route is `/neutral-site/`; it is CSS-only and uses native semantics.

## Before actual project adoption

- [x] The CUBE migration establishes the `nbr` CSS namespace and five-layer contract; review collisions before any future adopter.
- [x] The approved Phase 3 Stack/Cluster Compositions, two one-job Utilities, and neutral executable fixture are included; no generated utility matrix or adopter work is included.
- [x] Automated affected behavior QA covers Composition wrapping/nesting, RTL and supported vertical writing mode, long unbroken content, and 320px reflow in `tests/neutral-site.spec.js`: focused Playwright run passed 9/9 across Chromium, Firefox, and WebKit; canonical `pnpm test` passed 150/150. Keyboard/focus, forced colors, reduced motion, and no-shadow manual runs remain separate residual checks.
- [x] The two Utilities remain within their 700 B minified / 350 B gzip budgets and the combined Utility layer remains within 1,200 B minified / 600 B gzip; remove a Utility if its contract needs a modifier matrix or `!important`.
- [x] Phase 4 packages the private `0.1.0-alpha.0` local archive with deterministic checksum/provenance; publication remains disabled.
- [ ] Manual accessibility, hardware, OS forced-colors, and true browser-UI zoom checks remain unexecuted; further Blocks and adopter work are deferred.

See `docs/current-surface.md`, `docs/status-and-support.md`, and `docs/manual-accessibility-testing.md` before using the evidence as a contract.
