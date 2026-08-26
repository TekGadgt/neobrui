# ADR-005: temporary layer contract and coexistence matrix

Status: accepted for Spike 4 evidence only. This repository remains disposable and unpublishable.

## Contract

Generated token CSS is imported first and emits `@layer neobrui.tokens`. The aggregate recipe entry emits `@layer neobrui.tokens, neobrui.recipes` and imports each standalone recipe into `neobrui.recipes`. This is the only library-owned layer order. Consumers may predeclare those names, add a later consumer layer, or use normal unlayered author CSS. Normal unlayered CSS outranks normal layered recipe CSS; the library does not retaliate with broad `!important`, IDs, reset rules, or framework selectors.

Recipe selectors remain global, temporary, and low specificity. Hooks are custom properties and `_nb-spike` classes only. Astro imports global CSS once in its page/layout and owns scoped CSS. CSS Modules owns hashed local classes alongside global recipes; core exports no module names. Tailwind is a separate pinned production fixture and has no neobrui plugin.

## Claims

- Supported: plain global CSS, source-order permutations, explicit predeclaration, later consumer layers, unlayered overrides, hostile failure demonstrations, CSS Modules coexistence, Astro scoped child styling, and Tailwind utility/hook ordering in the pinned fixtures.
- Conditional: Tailwind preflight behavior is consumer-owned and must be reviewed when configuration changes; Astro global import must occur once through application integration.
- Dropped: framework markup coupling, undocumented internals, broad `!important`, IDs, adapter packages, disabled scoping, and any claim that neobrui defeats hostile consumer CSS.

## Exact tools

Root: pnpm 11.24.0, Vite 7.3.6, Playwright 1.62.1, axe-core/playwright 4.13.0. CSS Modules uses Vite 7.3.6. Astro uses Astro 5.13.5. Tailwind uses Tailwind CSS and @tailwindcss/cli 4.1.13.

The Tailwind fixture imports the generated token CSS as an explicit application-owned input and selects `personal-light`; it has no neobrui plugin or adapter. Evidence capture is opt-in via `CAPTURE_EVIDENCE=1`, always uses the producing Playwright engine in the filename, and normal verification is non-mutating. Fixture `.astro/` generated state is ignored. See `evidence/spike-4-coexistence.md` for RED→GREEN cycles, computed-style matrix, builds, engine counts, and residual manual checks.
