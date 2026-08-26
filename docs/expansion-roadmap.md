# Expansion roadmap

This roadmap synthesizes `docs/personal-use-viability-and-expansion.md`. ADR-009 accepted the CUBE-primary direction; [`ADR-010`](../decisions/ADR-010-cube-migration-contract.md) is the normative migration contract. Acceptance does not mean implementation or adopter authorization.

## Architecture and release proposal

See [`docs/architecture-and-release-options.md`](architecture-and-release-options.md), [`decisions/ADR-009-architecture-proposal.md`](../decisions/ADR-009-architecture-proposal.md), and [`decisions/ADR-010-cube-migration-contract.md`](../decisions/ADR-010-cube-migration-contract.md). Direction is accepted, but implementation remains gated by ADR-010's phase acceptance checks and adopter authorization.

## Personal-use MVP

- Decide the stable CSS namespace, package/repository/license posture, distribution, token authoring authority, DTCG format/version and theme organization, theme scoping, and first adopter.
- Preserve foundations plus standalone/aggregate Surface, Button, and Field, with zero runtime JavaScript and product-owned semantics/identity.
- Document token authoring, native markup, layers, RTL/no-shadow behavior, plain CSS and Astro use, and the manual QA boundary.
- Add validated deterministic DTCG export, schema/alias/type and round-trip boundary tests, CSS equivalence checks, provenance, and size/maintenance accounting from the first formal implementation; do not maintain independently editable JS and DTCG sources.
- Add only evidence-backed Stack and Cluster layout primitives if Ryan approves implementation; validate with the full browser matrix, size checks, and affected integration tests.
- Prove a neutral example, then one bounded private adoption with rollback.

## Useful next (demand-gated)

Rule, Link, Badge/Tag, Callout, and broader Field coverage (textarea/select) may be considered after repeated real use. Checkbox/radio require a real form flow and a larger manual/forced-colors/touch matrix. Private cross-repository CI, versioning, changelog, and archive verification are useful only after distribution and ownership decisions.

## Public-framework-only

Public source governance (license, CONTRIBUTING, security/support and issue policy), registry publication/release automation, public accessibility/browser support claims, and user/outreach evidence are separate future gates. They require an explicit public-source decision, provenance/CI/release policy, manual AT/OS/device runs, support capacity, and authorized user evidence. Public source does not automatically mean supported framework.

## Reject or defer

Defer runtime component JavaScript, framework adapters/plugins while CSS coexistence works, global resets/hostile specificity, bundled identity, product/editor/QR/hosting abstractions, arbitrary recipe-count targets, and indefinite `_nb-spike` compatibility aliases. DTCG is no longer deferred: its bounded interchange surface is part of the proposed personal-use MVP, subject to Ryan’s canonical-authority and format/version decisions.

## Current implementation gates

The stable namespace, package posture, license intent, distribution, versioning, token authority, DTCG pin, theme scoping, and layout API are recorded in ADR-010. They are not implemented yet. Phase acceptance, rollback, and stop conditions must pass before any selector is exposed to another project; the neutral site precedes any separately authorized adopter.

## Gate discipline

Every expansion should name its consumer evidence, API decision, affected automated slice, manual QA slice, rollback, and support wording. Keep the existing Chromium/Firefox/WebKit coverage; never substitute one engine for the declared matrix. DTCG additions must also name the supported format subset, provenance, deterministic-output check, schema/round-trip/equivalence tests, and size/maintenance budget.
