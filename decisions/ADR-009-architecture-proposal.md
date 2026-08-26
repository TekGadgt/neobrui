# ADR-009: Neobrui architecture and release proposal

Status: Proposed
Date: 2026-08-26

## Context

The current repository is a private, CSS-only personal-use pilot. It has validated semantic tokens and opt-in Surface, Button, and Field recipes, but no approved stable namespace, package contract, release process, public-source posture, support promise, or layout primitive API. The next decision must separate personal-use implementation from later GitHub-source, supported-library, and competitive-framework gates.

Ryan’s settled direction is that Neobrui (“neobrutalism UI”) is the preferred working name, personal projects are the first purpose, MIT is acceptable if public source is later created, distribution is GitHub-first with versioned releases, and adoption starts with a neutral test site followed by a bounded HTML Day Lite slice. DTCG is now in scope for the first formal personal-use MVP as an interchange surface, while its canonical authority remains a Ryan decision.

## Proposal

This ADR proposes, but does not accept, the following bundle:

- Adopt a small ITCSS/CUBE hybrid: emitted tokens/settings, layouts/compositions, recipes/blocks, and minimal utilities. `Stack` and `Cluster` are compositions; Surface/Button/Field are recipes. Do not add resets or generic element takeover.
- Select one concise project-owned namespace consistently across classes, data attributes, custom properties, and cascade layers. `nbr-` is the recommended candidate over `nb-`, `neobrui-`, and generic `neo-`; Ryan must approve it. `_nb-spike` aliases are not a lasting compatibility plan.
- Keep validated JS/TS token/theme maps as the proposed initial canonical authoring source, with deterministic generated DTCG and CSS outputs. DTCG JSON canonical with generated JS/CSS remains the alternative. Never maintain two independently editable sources.
- Pin and validate a specific DTCG format/version and supported subset (`$value`, `$type`, groups, aliases/references, paths, and configured theme organization). Record provenance, deterministic ordering, schema validation, CSS equivalence, and bounded import/round-trip behavior. DTCG does not own application theme toggles or selectors.
- Keep theme state in the product. Neobrui maps configured selectors, resolves complete maps before output, supports validated authoring inheritance only, and makes global defaults opt-in.
- If approved, implement Stack as a nested-safe flex column with `gap`, and Cluster as a wrapping flex row with `gap` plus alignment/justification hooks. Prefer one class each with namespaced custom-property hooks and token defaults, not a utility matrix. QA includes RTL/writing mode, 320px, nesting, long content, and overrides.
- Keep npm private and unpublished, without registry credentials or `publishConfig`, independent of any later GitHub visibility decision. When authorized, distribute deterministic CSS archives via Git tags and GitHub Releases; use semantic `0.x` versioning and reversible prior release assets.
- Keep `neobrui` as the working name unless concrete collision/trademark/search evidence changes that recommendation. Alternatives are comparison only.

## DTCG implementation boundary

The first personal-use implementation should include DTCG export, format pinning, schema validation, alias/type tests, round-trip boundaries, deterministic output, CSS-equivalence tests, provenance, and explicit size/maintenance accounting. The output is an interchange artifact, not a second authoring source and not a theme-state mechanism. Unknown features are rejected or explicitly bounded rather than silently guessed. DTCG compatibility follows the project’s documented `0.x` policy.

No token files, exporters, selectors, CSS, package metadata, or recipes are changed by this documentation ADR.

## Gates and rollback

Implementation is gated on Ryan recording namespace, canonical token authority, DTCG pin/theme organization, package posture, release/versioning, theme scoping, and Stack/Cluster details. The first executable consumer is a neutral test site. The next is a side-by-side HTML Day Lite Surface/Button/Cluster slice with rollback; there is no simultaneous personal-site migration.

A later GitHub-source gate checks namespace, MIT, README, CI, secrets/history, provenance, release assets, and support wording. A supported-library gate additionally requires manual accessibility runs, a browser/version policy, maintenance capacity, and a security/support process. A competitive-framework gate additionally requires multiple adopters, evidence-backed expansion, docs/examples, user evidence, and sustained support capacity. None is currently passed.

## Decision ownership

This ADR intentionally records proposed defaults and unresolved choices; it does not silently adopt an architecture or public-release policy. Ryan’s explicit choices are tracked in `docs/architecture-and-release-options.md`.

The complete first-party CUBE review is recorded in `docs/cube-css-fit-review.md`. Its CUBE-primary recommendation is research input only: CUBE architecture acceptance remains pending Ryan’s decision, and this ADR remains Proposed.

## References

- `docs/cube-css-fit-review.md`
- `docs/architecture-and-release-options.md`
- `docs/expansion-roadmap.md`
- `docs/status-and-support.md`
- `decisions/ADR-008-personal-use-positioning.md`
- ITCSS: https://itcss.io/
- CUBE CSS: https://cube.fyi/
- DTCG specification: https://www.designtokens.org/
- npm private packages: https://docs.npmjs.com/cli/v11/configuring-npm/package-json
- GitHub Releases: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- Semantic Versioning: https://semver.org/
- MIT License: https://opensource.org/license/mit/
