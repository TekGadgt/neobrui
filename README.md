# neobrui disposable Spike 1 token-mapping harness

This is a private, unpublishable, disposable evidence harness—not a public package, API, product name, or deployment target. The `fixtures/plain` baseline is intentionally semantic HTML and works with JavaScript disabled. This spike makes no runtime-JavaScript commitment for a future CSS core.

The existing `/workspace/personal_site` and `/workspace/htmlday-lite` repositories are read-only evidence sources. They are not imported, copied, edited, submoduled, or referenced by this repository.

## Scope boundary

Spike 4 adds a temporary, explicit cascade-layer contract and isolated coexistence evidence under `fixtures/coexistence`, `fixtures/css-modules`, `fixtures/astro`, and `fixtures/tailwind`. These are fixture-only integrations: no public package/API, runtime core JavaScript, adapter, or plugin is introduced. Astro and Tailwind remain separate packages.

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

`pnpm test` validates required roles and runs Chromium, Firefox, and WebKit. It checks fixture content, JavaScript-disabled usability, absence of external requests, private/unpublishable project metadata, forbidden cross-project references, the built HTML entries, and isolated route identity/CSS delivery. The Tailwind fixture imports generated tokens as an application-owned input and the `/tailwind/` browser check proves recipe variables and the `p-4` utility resolve together. Generated CSS is `fixtures/plain/generated-tokens.css`; source and decision/evidence records are under `src/tokens/`, `scripts/`, `decisions/`, and `evidence/`.

Normal verification is non-mutating: screenshot capture is gated behind `CAPTURE_EVIDENCE=1` and writes the producing engine into every evidence filename. Fixture `.astro/` metadata is ignored. Root Vite, Playwright, and axe tooling is exactly pinned to 7.3.6, 1.62.1, and 4.13.0 respectively; the frozen lockfile is authoritative.

DTCG export is deliberately deferred: no named consumer or authorized importer/exporter exists for this disposable spike. Core identifiers remain semantic and temporary (`_nb-spike`); application palette, fonts, content, motifs, and behavior stay fixture-owned.

## Portability

The container uses its own Linux `node_modules` volume; host dependencies remain separate and are never synchronized. The explicit macOS/Linux and arm64/x64 architecture matrix keeps the shared lockfile portable across supported checkouts.

No publish or deployment configuration is present by design. Do not publish this repository.
