# neobrui disposable Spike 1 token-mapping harness

This is a private, unpublishable, disposable evidence harness—not a public package, API, product name, or deployment target. The `fixtures/plain` baseline is intentionally semantic HTML and works with JavaScript disabled. This spike makes no runtime-JavaScript commitment for a future CSS core.

The existing `/workspace/personal_site` and `/workspace/htmlday-lite` repositories are read-only evidence sources. They are not imported, copied, edited, submoduled, or referenced by this repository.

## Scope boundary

Spike 1 adds a finite semantic token schema, build-time CSS generator, and five isolated fixture inputs/routes: personal-light, personal-dark, workshop, nested-theme, and neutralized. Values and content remain fixture-owned. Native fixture elements demonstrate states but are not reusable Surface/Button/Field recipes. It still does not include a public package/API, runtime JavaScript, DTCG output, adapters, Storybook, Tailwind, Astro, CSS Modules, or a component library implementation.

Temporary class/custom-property naming, if needed in this spike, uses the documented `_nb-spike` prefix. The prefix is disposable and is not a public naming decision.

## Verification

```sh
pnpm install --frozen-lockfile
pnpm validate:tokens
pnpm build:tokens
pnpm build
pnpm test
# or all three, in order:
pnpm verify
```

`pnpm test` validates required roles and runs Chromium, Firefox, and WebKit. It checks fixture content, JavaScript-disabled usability, absence of external requests, private/unpublishable project metadata, forbidden cross-project references, and the temporary prefix policy. Generated CSS is `fixtures/plain/generated-tokens.css`; source and decision/evidence records are under `src/tokens/`, `scripts/`, `decisions/`, and `evidence/`.

DTCG export is deliberately deferred: no named consumer or authorized importer/exporter exists for this disposable spike. Core identifiers remain semantic and temporary (`_nb-spike`); application palette, fonts, content, motifs, and behavior stay fixture-owned.

## Portability

The container uses its own Linux `node_modules` volume; host dependencies remain separate and are never synchronized. The explicit macOS/Linux and arm64/x64 architecture matrix keeps the shared lockfile portable across supported checkouts.

No publish or deployment configuration is present by design. Do not publish this repository.
