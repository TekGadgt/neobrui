# neobrui disposable Spike 0 harness

This is a private, unpublishable, disposable evidence harness—not a public package, API, product name, or deployment target. The `fixtures/plain` baseline is intentionally semantic HTML and works with JavaScript disabled. This spike makes no runtime-JavaScript commitment for a future CSS core.

The existing `/workspace/personal_site` and `/workspace/htmlday-lite` repositories are read-only evidence sources. They are not imported, copied, edited, submoduled, or referenced by this repository.

## Scope boundary

Spike 0 includes only a local static Vite fixture, three-engine Playwright acceptance checks, reproducible install/build/test commands, and an evidence template. It does not include tokens, themes, Surface/Button/Field recipes, DTCG output, package publication, adapters, Storybook, Tailwind, Astro, CSS Modules, or a component library implementation.

Temporary class/custom-property naming, if needed in this spike, uses the documented `_nb-spike` prefix. The prefix is disposable and is not a public naming decision.

## Verification

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
# or all three, in order:
pnpm verify
```

`pnpm test` runs Chromium, Firefox, and WebKit. It checks fixture content, JavaScript-disabled usability, absence of external requests, private/unpublishable project metadata, forbidden cross-project references, and the temporary prefix policy.

## Portability

The container uses its own Linux `node_modules` volume; host dependencies remain separate and are never synchronized. The explicit macOS/Linux and arm64/x64 architecture matrix keeps the shared lockfile portable across supported checkouts.

No publish or deployment configuration is present by design. Do not publish this repository.
