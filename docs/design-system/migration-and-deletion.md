# Migration and deletion manifest

## Maintainer flow

Before: generate token schema/DTCG/themes, build multiple compatibility fixtures, create a deterministic release archive, prepare extracted docs assets, then run route-specific docs rewrites.

After: author semantic CSS in `src/`, run `pnpm test`, build docs with `pnpm --filter neobrui-docs build`, and inspect `npm pack --dry-run`. Product themes live with consuming products; docs import the package source directly.

## Kept

- `src/foundations.css`, `layout.css`, `utilities.css`, `primitives.css`, and aggregate `index.css`.
- Starlight shell/search/nav and seven content pages.
- Root-owned lockfile and browser tooling for release-boundary checks.
- `docs/design-system/` authority and `skills/neobrui/` repository guidance.

## Deleted in this reset

- Generated token schema, DTCG interchange, and token build machinery.
- Legacy Button and Field blocks, block aggregate, wrapper utility, and compatibility naming.
- Custom archive/release staging and size-report machinery.
- Generated docs extraction and custom Search override.
- Obsolete docs routes for the prior internal information architecture.

No compatibility aliases are retained. Any future addition must demonstrate a real repeated need and update the authority ADR first.
