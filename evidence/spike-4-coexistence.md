# Spike 4 coexistence evidence

## TDD cycles

- RED: matrix assertions for consumer layer and hostile ownership were added before the `@layer neobrui.tokens, neobrui.recipes` declaration; the layered recipe did not yet expose a stable consumer order.
- GREEN: token generation now wraps output in `neobrui.tokens`; each aggregate recipe import is in `neobrui.recipes`; focused matrix assertions pass.
- RED: CSS Modules fixture required a local hashed class plus global recipe class.
- GREEN: Vite CSS Modules build produces a hashed local class while global `_nb-spike` remains present.
- RED: Tailwind's production CSS omitted generated token definitions, leaving recipe variables unresolved.
- GREEN: the Tailwind fixture explicitly imports `../plain/generated-tokens.css`, selects `personal-light`, and the browser assertion proves recipe background/border and Tailwind `p-4` padding resolve together.
- RED: clean verification's one-shot `pgrep` allowed Playwright's preview shell/child to survive briefly after exit, and fixture builds had no browser reachability assertion.
- GREEN: `waitForOwnedPreviewExit` narrowly matches repo-cwd Vite preview port 4173 processes, polls every 100ms for up to 5000ms, and has deterministic delayed-success/timeout unit tests. An owned port-4174 server serves built CSS Modules `/css-modules/` and Astro `/astro/` routes for browser assertions.

## Computed-style matrix

| Case | Expected result | Evidence |
|---|---|---|
| recipe before app CSS | app unlayered background wins | `.normal` = rgb(30,64,175) |
| later consumer layer | hook custom property wins | `.explicit` = rgb(22,101,52) |
| explicit predeclaration | token then recipe order is stable | generated CSS + recipe CSS |
| hostile `all: unset` | display becomes inline; consumer owns failure | `.hostile` assertion |
| hostile `!important` | red background wins | `.hostile` assertion |
| CSS Modules | `_panel_<hash>_<line>` plus `_nb-spike-*`; 16px local padding and recipe background `rgb(143,45,45)`/2px border | `/css-modules/` built route |
| Astro scoped child | global recipe background `rgb(143,45,45)`, scoped border `rgb(22,101,52)`, child `rgb(30,64,175)` | `/astro/` built route |
| Tailwind utility/preflight | utility and preflight remain consumer-owned | `/tailwind/` computed styles: recipe background `rgb(22,101,52)`, 2px border, utility padding 16px |

Matrix route is checked at LTR/RTL and 320/1024px (8 cases) in every declared Playwright engine. The final full matrix is 138 passed (46 per Chromium, Firefox, and WebKit); the Chromium-only capture remains 44 passed because production fixture checks are skipped only under `CAPTURE_EVIDENCE=1`. Hostile failures are intentional evidence, not library defects.

## Commands

`pnpm install --frozen-lockfile`; `pnpm build:fixtures`; `pnpm test`; `pnpm capture:chromium`; `pnpm verify:clean`. The clean command's immediate independent post-exit check must find no repo-owned preview process; the bounded timeout path is covered by `tests/preview-process.test.mjs` without leaking a fake process.

No external requests are used by fixtures. Normal tests never write evidence. `pnpm capture:chromium` expands to `CAPTURE_EVIDENCE=1 pnpm exec playwright test --project=chromium` and produces exactly 44 Chromium tests. Its browser-specific, engine-labelled paths are `.evidence-cache/screenshots/*-chromium.png`, an ignored generated directory outside committed `evidence/screenshots/`; Firefox and WebKit captures are not produced by this command, and no workflow refreshes tracked screenshots. `pnpm verify:clean` owns and terminates preview servers and passes only when `git status --porcelain` is empty. Astro `.astro/` metadata is ignored. Manual residual checks: physical keyboard traversal, screen-reader announcements, forced-colors hardware, and human review at true browser zoom 200%.
