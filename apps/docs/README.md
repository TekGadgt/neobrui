# Neobrui docs

This is a separate Astro Starlight site consuming an extracted copy of the exact local release archive. It is intentionally not part of the root pnpm workspace; all tooling resolves from the root dependency tree.

## Local Pages-equivalent build

From the repository root, generate the approved release, prepare its package files, then build with the root dependency tree:

```sh
pnpm run build:docs
PUBLIC_SITE_BASE=/neobrui/ PUBLIC_SITE_URL=https://tekgadgt.github.io/neobrui/ pnpm run build:docs:pages
```

The preparation step validates the canonical archive checksum and extracts only its expected public files into ignored `apps/docs/.generated/neobrui/`. Do not create `apps/docs/node_modules`; the repository’s root `node_modules` is the portable workspace dependency volume.

Preview a root-base build from the repository root with:

```sh
pnpm preview:docs
```

Preview the GitHub Project Pages-equivalent build with:

```sh
pnpm preview:docs:pages
```

Then open `http://localhost:4321/neobrui/`.

The build and preview commands must use the same `PUBLIC_SITE_BASE`. A Pages build emits browser URLs such as `/neobrui/_astro/...`, while the deploy host mounts the artifact root at `/neobrui/`. A plain static server that mounts `apps/docs/dist` at `/` does not emulate GitHub Project Pages and will look for a nonexistent `dist/neobrui/_astro/` directory. To serve `apps/docs/dist` at `/`, first make a root-base build with `pnpm build:docs`.

The static output includes Starlight’s Pagefind index.

## Pagefind search accessibility guard

`src/components/Search.astro` is the supported Starlight `components.Search` override. It wraps the pinned `@astrojs/starlight` 0.41.9 default Search component and scopes one short-lived `MutationObserver` to its `#starlight__search` mount. Pagefind 1.5.2 dynamically creates `.pagefind-ui__search-input` with a `title` but no accessible name, so the observer copies the localized open-search button label to `aria-label` and disconnects as soon as the input exists. It preserves Pagefind’s title and placeholder and does not replace or fork the default search UI.

Keep the regression test in `tests/navigation.spec.js` and the full axe matrix active while upgrading Astro, Starlight, or Pagefind. Remove the override when the upstream generated input has a non-title accessible name in all supported browsers; first confirm the upgrade in root and `/neobrui/` builds and both search behavior and axe tests.

## GitHub Pages activation guide

The reviewed workflows target `https://tekgadgt.github.io/neobrui/` and require no long-lived secret. After the first authorized push of `main`, open repository **Settings → Pages**, set **Source** to **GitHub Actions**, and wait for the `Deploy docs to GitHub Pages` workflow to complete. The deployment environment is `github-pages` and publishes only `apps/docs/dist`.

To roll back, redeploy the last known-good `main` commit (or disable the Pages workflow and set Pages source to **Deploy from a branch** only if an operator explicitly chooses that alternative). Do not publish npm artifacts. After the first green run, protect `main` and require the CI status checks before merge; keep deployment restricted to `main`.

Before any publication, review the private-alpha and manual accessibility boundaries. No workflow credentials or npm publication permissions are required.
