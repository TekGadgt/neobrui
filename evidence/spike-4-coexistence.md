# Spike 4 coexistence evidence

## TDD cycles

- RED: matrix assertions for consumer layer and hostile ownership were added before the `@layer neobrui.tokens, neobrui.recipes` declaration; the layered recipe did not yet expose a stable consumer order.
- GREEN: token generation now wraps output in `neobrui.tokens`; each aggregate recipe import is in `neobrui.recipes`; focused matrix assertions pass.
- RED: CSS Modules fixture required a local hashed class plus global recipe class.
- GREEN: Vite CSS Modules build produces a hashed local class while global `_nb-spike` remains present.
- RED: Tailwind's production CSS omitted generated token definitions, leaving recipe variables unresolved.
- GREEN: the Tailwind fixture explicitly imports `../plain/generated-tokens.css`, selects `personal-light`, and the browser assertion proves recipe background/border and Tailwind `p-4` padding resolve together.

## Computed-style matrix

| Case | Expected result | Evidence |
|---|---|---|
| recipe before app CSS | app unlayered background wins | `.normal` = rgb(30,64,175) |
| later consumer layer | hook custom property wins | `.explicit` = rgb(22,101,52) |
| explicit predeclaration | token then recipe order is stable | generated CSS + recipe CSS |
| hostile `all: unset` | display becomes inline; consumer owns failure | `.hostile` assertion |
| hostile `!important` | red background wins | `.hostile` assertion |
| CSS Modules | hashed class and global recipe coexist | fixture build output |
| Astro scoped child | `.child` remains application-owned | Astro output |
| Tailwind utility/preflight | utility and preflight remain consumer-owned | `/tailwind/` computed styles: recipe background `rgb(22,101,52)`, 2px border, utility padding 16px |

Matrix route is checked at LTR/RTL and 320/1024px (8 cases) in every declared Playwright engine. The final full matrix is 132 passed (44 per Chromium, Firefox, and WebKit); hostile failures are intentional evidence, not library defects.

## Commands

`pnpm install --frozen-lockfile`; `pnpm build`; `pnpm build:fixtures`; `pnpm test`; `CAPTURE_EVIDENCE=1 pnpm test -- --project=chromium`; `pnpm validate:tokens`.

No external requests are used by fixtures. Normal tests never write evidence. Explicit `CAPTURE_EVIDENCE=1` writes browser-specific paths (`*-chromium|firefox|webkit.png`); the documented refresh command intentionally captures Chromium only, so Chromium-labeled legacy evidence is not overwritten by other engines. Astro `.astro/` metadata is ignored. Manual residual checks: physical keyboard traversal, screen-reader announcements, forced-colors hardware, and human review at true browser zoom 200%.
