# ADR-008: Personal-use positioning

Status: accepted for the current pilot; not a public API or publication decision.

## Decision

Treat Neobrui as Ryan's private, personal-use CSS pilot. The validated current surface is semantic tokens plus opt-in Surface, Button, and Field recipes, with product-owned identity and native HTML behavior, zero runtime JavaScript in the candidate, local/private archive safeguards, and Chromium/Firefox/WebKit automation. Keep `_nb-spike` names and package metadata explicitly provisional until a later namespace/package decision.

## Rationale

The viability assessment shows repeatable fixture evidence for the narrow surface, layers, direction/shadows, integrations, size/archive boundaries, and seeded QA. It does not show a stable namespace, public governance, manual AT/device execution, user evidence, or support capacity. Personal projects can use the evidence after deliberate decisions without implying framework completeness or support.

## Boundaries

This decision does not select an npm scope, license, stable CSS namespace, public repository posture, versioning policy, adopter, layout API, or publication path. It does not add recipes, adapters, runtime JS, a reset, a bundled theme, or compatibility aliases. The private archive remains unpublishable and local-only. Manual procedures are documentation, not results, unless a dated run record exists.

## Revisit triggers

Revisit before actual project adoption, a namespace/package rename, adding Stack/Cluster or another recipe, changing token/theme contracts, choosing a license or public source, publishing an archive, making browser/AT support claims, accepting external users, or establishing CI/release/support commitments. Each trigger requires evidence, affected QA, rollback, and an explicit Ryan decision.

## References

- `docs/current-surface.md`
- `docs/getting-started-personal-use.md`
- `docs/status-and-support.md`
- `docs/expansion-roadmap.md`
- `docs/personal-use-viability-and-expansion.md`
- `docs/manual-accessibility-testing.md`
