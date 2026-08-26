# neobrui personal-use pilot

Neobrui is a validated, private, CSS-only personal-alpha release for Ryan's projects. It is a narrow semantic styling surface—not a public framework, 1.0-stable API, product identity, deployment target, or support promise. The current repository remains local and npm-private by design.

## What exists today

- Semantic token schema and deterministic generated CSS/DTCG 2025.10 interchange; themes, palettes, fonts, content, and motifs stay product-owned.
- Product-owned theme selector manifest, bounded DTCG import/round-trip, aliases, types, provenance, and per-theme generated artifacts (see [theme authoring and DTCG](docs/theme-authoring-and-dtcg.md)).
- Opt-in `Surface`, `Button`, and `Field` blocks plus Stack/Cluster compositions and the initial visually-hidden/wrapper utilities, with standalone and aggregate CSS entries.
- Native HTML contracts, RTL/nested/fixed shadow behavior, no-shadow safety cues, and explicit cascade-layer coexistence.
- Plain CSS, CSS Modules, Astro, and Tailwind integration fixtures (evidence, not adapters or blanket compatibility).
- Zero runtime JavaScript/assets/dependencies in the private CSS release.
- Automated Chromium, Firefox, and WebKit fixture checks, deterministic archive/consumer size checks, and seeded QA rehearsal.

The current evidence is intentionally narrow. Standalone Button has a provisional minified-size warning (2,413 B versus a 1,800 B hypothesis) while remaining below the gzip warning/kill limits; this is not a publication signal.

## Personal-alpha boundaries

The `nbr` classes, data attributes, custom properties, and five-layer names are the accepted CUBE contract. The package is versioned `0.1.0-alpha.0`, remains private and unpublished, and follows the documented semantic `0.x` policy. MIT describes the future source posture; it does not authorize publication, support, or adopter migration.

Native HTML and the application own semantics, keyboard behavior, link navigation, validation, disabled behavior, announcements, routing, and state. Automation does not establish manual assistive-technology, OS forced-colors, physical keyboard/touch, or true browser-UI zoom support. Procedures are documented but unexecuted unless a dated run record says otherwise.

## Local setup and verification

```sh
pnpm install --frozen-lockfile
pnpm validate:tokens
pnpm build
pnpm test
pnpm verify:size
# canonical clean-tree verification:
pnpm verify:clean
```

`pnpm test` includes unit contracts, token validation, and the configured Chromium/Firefox/WebKit Playwright projects. `pnpm verify:size` is fresh and non-mutating; `pnpm measure:size` intentionally regenerates `size-report.json`.

## Repository boundaries

- Connected/comparison projects are read-only evidence and are not imported or edited by this repository.
- Container dependencies live in a container-only Linux `node_modules` volume.
- Host dependency trees remain separate.
- The declared darwin/linux and arm64/x64 architecture matrix supports a shared lockfile contract that remains portable, not synchronized dependency directories.

## Formal docs

- [Accepted CUBE migration contract](decisions/ADR-010-cube-migration-contract.md)
- [ADR-009: accepted architecture direction](decisions/ADR-009-architecture-proposal.md)

- [Current surface](docs/current-surface.md)
- [Getting started for personal use](docs/getting-started-personal-use.md)
- [Status and support](docs/status-and-support.md)
- [Expansion roadmap](docs/expansion-roadmap.md)
- [ADR-008: personal-use positioning](decisions/ADR-008-personal-use-positioning.md)
- [Manual accessibility testing procedure](docs/manual-accessibility-testing.md)
- [Local release workflow](docs/local-release-workflow.md)
- [Pre-GitHub checklist](docs/pre-github-checklist.md)
- [Accessibility test-run template](docs/templates/accessibility-test-run.md)
- [Personal-use viability and expansion](docs/personal-use-viability-and-expansion.md)
- [Historical pre-migration viability assessment](evidence/historical/personal-use-viability-and-expansion.md)

The manual guide and template define cadence for personal-project adoption, affected behavior changes, release-candidate review, and any future public-support gate. They are procedures, not executed results.

## No publication or support promise

This pilot is for controlled local personal use only. Competitive framework positioning, broad accessibility support, outreach, public GitHub source, package publication, and ongoing support are separate future gates. See the roadmap and status docs before making any claim beyond the validated fixture evidence.
