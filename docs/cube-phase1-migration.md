# CUBE Phase 1 migration evidence

Status: Implemented locally on the Phase 1 feature branch (2026-08-26)

## Stable migration map

| Concern | Phase 1 result |
| --- | --- |
| Surface Block | `._nb-spike-surface` → `.nbr-surface` |
| Button Block | `._nb-spike-button` → `.nbr-button` |
| Field Block | `._nb-spike-field` → `.nbr-field` |
| Presentational level Exception | `data-_nb-level` → `data-nbr-level` |
| Fixed shadow Exception | `data-_nb-shadow-direction` → `data-nbr-shadow-direction` |
| Field organization hooks | `data-_nb-description`, `data-_nb-error` → `data-nbr-description`, `data-nbr-error` |
| Theme ownership | internal theme attribute replaced by product fixture `data-theme` |
| Custom properties | `--_nb-*` → normalized `--nbr-*`; camelCase becomes kebab-case |
| Source ownership | `src/recipes` → `src/blocks`; Surface/Button/Field remain the only Blocks |

No compatibility aliases are emitted. Historical ADR/evidence references remain only where explicitly labeled as prior evidence.

## Layer proof

The aggregate entry predeclares exactly, in order:

```css
@layer nbr.tokens, nbr.compositions, nbr.utilities, nbr.blocks, nbr.exceptions;
```

Phase 1 emits token rules in `nbr.tokens`, Block rules in `nbr.blocks`, and leaves `nbr.compositions` and `nbr.utilities` empty. Presentational level and fixed-shadow selectors are owned by Block styles but target the `nbr.exceptions` contract; native pseudo-classes and ARIA selectors remain in Block ownership.

## Verification evidence

- RED: `tests/cube-contract.test.mjs` failed against the pre-migration `neobrui.tokens`/`--_nb-*` output.
- GREEN: token contract and all 12 Node unit tests pass after migration.
- `pnpm build:fixtures` passes for root, Blocks, CSS Modules, Astro, and Tailwind fixtures.
- Generated package is private, CSS-only, has zero runtime JavaScript/dependencies, and uses stable `neobrui` consumer imports.
- Size report remains `warning/narrow` because the migrated Button Block exceeds its historical minified-byte budget while remaining below the kill threshold; no budget was silently changed.

## Preserved limitations

Stack, Cluster, Utilities, DTCG interchange, package publication, release metadata, and adopter migrations remain out of Phase 1. Theme state remains product-owned; Neobrui emits no toggle or runtime state machine.
