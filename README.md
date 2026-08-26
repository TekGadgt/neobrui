# neobrui personal-use pilot

Neobrui is a validated, private, CSS-only personal-use pilot for Ryan's projects. It is evidence for a narrow semantic styling surface—not a public framework, stable package/API, product identity, deployment target, or support promise. The current repository remains private and unpublishable by design.

## What exists today

- Semantic token schema and deterministic generated CSS; themes, palettes, fonts, content, and motifs stay product-owned.
- Opt-in `Surface`, `Button`, and `Field` recipes, with standalone and aggregate CSS entries.
- Native HTML contracts, RTL/nested/fixed shadow behavior, no-shadow safety cues, and explicit cascade-layer coexistence.
- Plain CSS, CSS Modules, Astro, and Tailwind integration fixtures (evidence, not adapters or blanket compatibility).
- Zero runtime JavaScript/assets/dependencies in the private CSS candidate.
- Automated Chromium, Firefox, and WebKit fixture checks, deterministic archive/consumer size checks, and seeded QA rehearsal.

The current evidence is intentionally narrow. Standalone Button has a provisional minified-size warning (2,413 B versus a 1,800 B hypothesis) while remaining below the gzip warning/kill limits; this is not a publication signal.

## Provisional boundaries

`_nb-spike` classes, data attributes, custom properties, layer names, and the private package/archive name are disposable evidence. No stable CSS namespace, npm scope, license, public repository posture, registry distribution, semver, or support policy has been selected. Do not expose the selectors to another project or publish the archive without a later decision.

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

- [Current surface](docs/current-surface.md)
- [Getting started for personal use](docs/getting-started-personal-use.md)
- [Status and support](docs/status-and-support.md)
- [Expansion roadmap](docs/expansion-roadmap.md)
- [ADR-008: personal-use positioning](decisions/ADR-008-personal-use-positioning.md)
- [Manual accessibility testing procedure](docs/manual-accessibility-testing.md)
- [Accessibility test-run template](docs/templates/accessibility-test-run.md)
- [Viability assessment and evidence index](docs/personal-use-viability-and-expansion.md)

The manual guide and template define cadence for personal-project adoption, affected behavior changes, release-candidate review, and any future public-support gate. They are procedures, not executed results.

## No publication or support promise

This pilot is for controlled local personal use only. Competitive framework positioning, broad accessibility support, outreach, public GitHub source, package publication, and ongoing support are separate future gates. See the roadmap and status docs before making any claim beyond the validated fixture evidence.
