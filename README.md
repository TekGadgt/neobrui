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
# canonical full verification (includes every fixture build):
pnpm verify
# reproducible clean-tree verification, including capture:
pnpm verify:clean
# explicit, non-mutating Chromium evidence capture (44 tests):
pnpm capture:chromium
```

`pnpm test` runs the unit contracts, validates required roles, and runs Chromium, Firefox, and WebKit. It checks fixture content, JavaScript-disabled usability, absence of external requests, private/unpublishable project metadata, forbidden cross-project references, the built HTML entries, and isolated route identity/CSS delivery. The production fixture checks also serve `fixtures/css-modules/dist` at `/css-modules/` and `fixtures/astro/dist` at `/astro/` through an owned port-4174 server, proving hashed local classes/global `_nb-spike` recipes and Astro scoped overrides by computed style. The Tailwind fixture imports generated tokens as an application-owned input and the `/tailwind/` browser check proves recipe variables and the `p-4` utility resolve together. Generated CSS is `fixtures/plain/generated-tokens.css`; source and decision/evidence records are under `src/tokens/`, `scripts/`, `decisions/`, and `evidence/`.

Normal verification is non-mutating. Explicit capture is only enabled by `pnpm capture:chromium` (the underlying command is `CAPTURE_EVIDENCE=1 pnpm exec playwright test --project=chromium`) and runs the preserved 44 Chromium evidence tests; production fixture assertions are intentionally full-matrix-only. It writes engine-labelled images only under the ignored `.evidence-cache/screenshots/` directory; committed `evidence/screenshots/` files are never refreshed by verification. `pnpm verify:clean` owns both Playwright servers, runs frozen install, all fixture builds, unit contracts, the 138-test full matrix (46 per engine), and capture, then polls the repo-owned Vite preview process tree every 100ms for up to 5000ms before checking tree cleanliness. It fails on any non-empty `git status --porcelain` or surviving preview process. Fixture `.astro/` metadata is ignored. Root Vite, Playwright, and axe tooling is exactly pinned to 7.3.6, 1.62.1, and 4.13.0 respectively; the frozen lockfile is authoritative.

DTCG export is deliberately deferred: no named consumer or authorized importer/exporter exists for this disposable spike. Core identifiers remain semantic and temporary (`_nb-spike`); application palette, fonts, content, motifs, and behavior stay fixture-owned.

## Portability

The container uses its own Linux `node_modules` volume; host dependencies remain separate and are never synchronized. The explicit macOS/Linux and arm64/x64 architecture matrix keeps the shared lockfile portable across supported checkouts.

No publish or deployment configuration is present by design. Do not publish this repository.
