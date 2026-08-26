# Expansion roadmap

This roadmap synthesizes `docs/personal-use-viability-and-expansion.md`; it does not create commitments or turn spike evidence into a public API.

## Personal-use MVP

- Decide the stable CSS namespace, package/repository/license posture, distribution, token authoring, theme scoping, and first adopter.
- Preserve foundations plus standalone/aggregate Surface, Button, and Field, with zero runtime JavaScript and product-owned semantics/identity.
- Document token authoring, native markup, layers, RTL/no-shadow behavior, plain CSS and Astro use, and the manual QA boundary.
- Add only evidence-backed Stack and Cluster layout primitives if Ryan approves implementation; validate with the full browser matrix, size checks, and affected integration tests.
- Prove a neutral example, then one bounded private adoption with rollback.

## Useful next (demand-gated)

Rule, Link, Badge/Tag, Callout, and broader Field coverage (textarea/select) may be considered after repeated real use. Checkbox/radio require a real form flow and a larger manual/forced-colors/touch matrix. Private cross-repository CI, versioning, changelog, and archive verification are useful only after distribution and ownership decisions.

## Public-framework-only

Public source governance (license, CONTRIBUTING, security/support and issue policy), registry publication/release automation, public accessibility/browser support claims, and user/outreach evidence are separate future gates. They require an explicit public-source decision, provenance/CI/release policy, manual AT/OS/device runs, support capacity, and authorized user evidence. Public source does not automatically mean supported framework.

## Reject or defer

Defer DTCG until a named importer and round-trip test exist. Reject runtime component JavaScript, framework adapters/plugins while CSS coexistence works, global resets/hostile specificity, bundled identity, product/editor/QR/hosting abstractions, arbitrary recipe-count targets, and indefinite `_nb-spike` compatibility aliases.

## Current decisions still needed

Ryan still owns the stable namespace, package name/private posture, repository/public-source posture, license, distribution, versioning, token authoring format, theme scoping, first adopter, layout API details, and the threshold separating personal kit, public source, and supported framework. Until those are recorded, selectors remain disposable evidence and should not be exposed to another project.

## Gate discipline

Every expansion should name its consumer evidence, API decision, affected automated slice, manual QA slice, rollback, and support wording. Keep the existing Chromium/Firefox/WebKit coverage; never substitute one engine for the declared matrix.
