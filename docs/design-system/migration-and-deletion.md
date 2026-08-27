# Migration and deletion manifest

## Maintainer flow

Before: generated token/DTCG artifacts, compatibility fixtures, release staging, extracted docs packages, and runtime search patches were maintained alongside the authored CSS.

After: author the public CSS in `src/`, run `pnpm test`, run `pnpm --filter neobrui-docs check`, build the docs with `pnpm --filter neobrui-docs build`, and inspect a real `npm pack` when packaging is explicitly requested. The docs site imports the authored public exports directly; no staging or generated package copy exists.

## Kept

- `src/foundations.css`, `layout.css`, `utilities.css`, `primitives.css`, and aggregate `index.css`.
- Starlight shell, maintained upstream Search, navigation, and seven content pages.
- Root lockfile, package manifest, and Playwright browser tooling.
- `docs/design-system/` authority and `skills/neobrui/` repository guidance.
- `evidence/historical/` only where it records decision history, never as current API guidance.

## Deleted

- Custom Search override and its runtime DOM patch.
- Generated token/DTCG, archive/release, size, fixture, preview, and QA helper scripts.
- Legacy package/block/composition tests that exercised removed architecture.
- Superseded ADR-002 through ADR-010 and obsolete local release/theme authoring docs.

## Current contract

The only supported verification path is the package scripts in `package.json`: `pnpm test`, `pnpm check`, `pnpm build`, `pnpm test:docs`, and `pnpm pack:check`. Workflows must reference only these commands or the documented direct `pnpm --filter neobrui-docs` equivalents. No compatibility aliases are retained.
