# Getting started for personal use

This repository is the local, private Phase 1 CUBE CSS pilot. Its stable current namespace is `nbr`, its source Blocks live under `src/blocks`, and the package/archive remain private and unpublished. Use a local checkout or the explicitly generated private archive only; do not resolve it from a registry or publish it.

## Local verification path

```sh
pnpm install --frozen-lockfile
pnpm validate:tokens
pnpm build
pnpm test
pnpm verify:size
```

`pnpm verify:size` performs a fresh non-mutating build and compares it with the committed report. `pnpm verify:clean` is the canonical full clean-tree path. Keep the three configured Playwright projects (Chromium, Firefox, WebKit).

## Define tokens and a theme

The validated authoring path is a JavaScript token map checked by `src/tokens/schema.mjs` and emitted by `src/tokens/tokens.mjs`. Copy the shape from `fixtures/inputs.mjs`, supply every required semantic role, and keep palette aliases, fonts, content, and motifs in the consuming project. DTCG export remains deferred. Theme values should be scoped by the product's existing theme state rather than introducing a second state machine.

## Consume CSS

The Phase 1 names below are the stable local contract. Product themes and `data-theme` state remain product-owned; Neobrui supplies semantic tokens and opt-in Blocks only.

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

Standalone versus aggregate: use the aggregate entry when all three blocks are needed; use standalone Surface, Button, or Field entries when the consumer needs a narrower CSS graph. The private archive's explicit CSS subpaths and zero-runtime-JS contents are measured in `size-report.json`.

## Before actual project adoption

- [x] Phase 1 selects the `nbr` CSS namespace and five-layer contract; review collisions before any adopter.
- [ ] Ryan decides package/repository posture, package name, distribution method, versioning, and license; preserve `private: true` until then.
- [ ] Ryan selects the first adopter: neutral fixture (recommended) or one bounded slice of `htmlday-lite`/`personal_site`.
- [ ] Write a migration map and bounded plan; keep product CSS and identity beside the migration.
- [ ] Trigger the affected behavior QA slice, including a dated manual run when the behavior falls in the manual guide.
- [ ] Define a one-commit rollback to the product-owned CSS and record duplication/glue/defects before expanding.

See `docs/current-surface.md`, `docs/status-and-support.md`, and `docs/manual-accessibility-testing.md` before using the evidence as a contract.
