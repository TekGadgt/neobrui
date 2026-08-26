# Expansion roadmap

This roadmap supersedes the historical pre-migration assessment in `evidence/historical/personal-use-viability-and-expansion.md`. ADR-009 accepted the CUBE-primary direction; [`ADR-010`](../decisions/ADR-010-cube-migration-contract.md) is the normative migration contract. Phase 4 has implemented the stable `nbr` namespace, CUBE layers, package exports, and the `0.1.0-alpha.0` local archive; later expansion remains gated and does not authorize adopter migration.

## Architecture and release proposal

See [`docs/architecture-and-release-options.md`](architecture-and-release-options.md), [`decisions/ADR-009-architecture-proposal.md`](../decisions/ADR-009-architecture-proposal.md), and [`decisions/ADR-010-cube-migration-contract.md`](../decisions/ADR-010-cube-migration-contract.md). Direction is accepted, but implementation remains gated by ADR-010's phase acceptance checks and adopter authorization.

## Personal-use MVP

- Preserve the implemented `nbr` namespace, private package/license posture, local distribution, token authoring authority, DTCG format/version and theme organization, product-owned `data-theme` scoping, and deferred adopter decision.
- Preserve foundations plus standalone/aggregate Surface, Button, and Field, with zero runtime JavaScript and product-owned semantics/identity.
- Document token authoring, native markup, layers, RTL/no-shadow behavior, plain CSS and Astro use, and the manual QA boundary.
- Preserve the validated deterministic DTCG export, schema/alias/type and round-trip boundary tests, CSS equivalence checks, provenance, and size/maintenance accounting; do not maintain independently editable JS and DTCG sources.
- Stack, Cluster, the two bounded Utilities, and a neutral executable example are implemented and validated in Phase 3; retain them in the current local alpha contract.
- Do not adopt HTML Day or the personal site yet; any future bounded adoption requires a separate authorization and rollback plan.

## Useful next (demand-gated)

Rule, Link, Badge/Tag, Callout, and broader Field coverage (textarea/select) may be considered after repeated real use. Checkbox/radio require a real form flow and a larger manual/forced-colors/touch matrix. Private cross-repository CI, versioning, changelog, and archive verification are useful only after distribution and ownership decisions.

## Public-framework-only

Public source governance (license, CONTRIBUTING, security/support and issue policy), registry publication/release automation, public accessibility/browser support claims, and user/outreach evidence are separate future gates. They require an explicit public-source decision, provenance/CI/release policy, manual AT/OS/device runs, support capacity, and authorized user evidence. Public source does not automatically mean supported framework.

## Reject or defer

Defer runtime component JavaScript, framework adapters/plugins while CSS coexistence works, global resets/hostile specificity, bundled identity, product/editor/QR/hosting abstractions, arbitrary block-count targets, and indefinite `nbr` compatibility aliases. DTCG is no longer deferred: its bounded interchange surface is part of the proposed personal-use MVP, subject to Ryan’s canonical-authority and format/version decisions.

## Current implementation gates

The stable namespace, package posture, license intent, distribution, versioning, token authority, DTCG pin, product-owned theme scoping, Phase 3 layout/utility APIs, and Phase 4 archive are recorded in ADR-010. The current archive is local and private; adopter work remains future scope. Manual accessibility is unexecuted, and further Blocks remain deferred.

## Gate discipline

Every expansion should name its consumer evidence, API decision, affected automated slice, manual QA slice, rollback, and support wording. Keep the existing Chromium/Firefox/WebKit coverage; never substitute one engine for the declared matrix. DTCG additions must also name the supported format subset, provenance, deterministic-output check, schema/round-trip/equivalence tests, and size/maintenance budget.
