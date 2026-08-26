# Personal-use viability and expansion

Status: Current Phase 4 viability boundary for `0.1.0-alpha.0`. This document describes the accepted private local personal-alpha release; the [historical assessment](../evidence/historical/personal-use-viability-and-expansion.md) preserves earlier decision evidence separately.

## Viability decision

Neobrui is viable as a narrow, private, CSS-only kit for Ryan's personal projects. Phase 4 provides the stable `nbr` namespace, semantic tokens, Surface, Button, Field, Stack, Cluster, and Utility contracts, an ordered five-layer cascade contract, a deterministic local archive, and product-owned theme state. It is not a public framework, published package, deployment target, or support promise.

The current contract is defined by [ADR-010](../decisions/ADR-010-cube-migration-contract.md). The accepted surface and usage examples are maintained in the [current surface guide](current-surface.md) and [personal-use getting started guide](getting-started-personal-use.md).

## Accepted current surface

- CSS-only output with no runtime JavaScript, assets, or runtime dependencies.
- Semantic token generation with strict role validation and fixture-owned theme maps.
- Opt-in Surface, Button, and Field Blocks with standalone and aggregate CSS entries.
- Native HTML semantics, keyboard behavior, validation, navigation, and application state.
- Explicit cascade layers: `nbr.tokens`, `nbr.compositions`, `nbr.utilities`, `nbr.blocks`, and `nbr.exceptions`.
- Plain CSS, CSS Modules, Astro, and Tailwind coexistence fixtures as integration evidence rather than adapters.
- Automated Chromium, Firefox, and WebKit checks plus deterministic package and size verification.

Products retain ownership of palette, typography, content, layout composition, theme persistence, application behavior, and security or privacy decisions. The [status and support boundary](status-and-support.md) records what automation proves and what remains unexecuted manual work.

## Expansion policy

Expansion is evidence-gated rather than count-gated:

1. Keep the current approved Blocks, Compositions, and Utilities stable while the private pilot is evaluated.
2. Prefer a neutral example before adopting the kit in a live project.
3. Treat the implemented Stack and Cluster contracts as current, and add new layout APIs only when repeated layout needs justify them.
4. Add form coverage, Rule, Link, Badge, or Callout only after a named consumer demonstrates the need and the required accessibility matrix is available.
5. Do not add framework adapters, runtime behavior, bundled identity, broad resets, or a public release without a new recorded decision.

The [expansion roadmap](expansion-roadmap.md) tracks these gates and the [manual accessibility procedure](manual-accessibility-testing.md) distinguishes procedures from dated results.

## Readiness boundary

The pilot may be used in controlled local work under the repository's automated browser matrix. GitHub publication, registry distribution, adopter migration (including HTML Day and the personal site), support commitments, and external user evidence remain future decisions. No claim of assistive-technology, operating-system, physical-device, or browser-UI zoom support is made until a dated manual run documents it.

For the reproducible local workflow, use the commands in the [repository README](../README.md). For historical context and the evidence that led to the current boundary, use the [archived assessment](../evidence/historical/personal-use-viability-and-expansion.md), which is intentionally excluded from the current vocabulary contract.
