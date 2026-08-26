# Neobrui docs

This is a separate Astro Starlight site consuming the exact local release archive. It is intentionally not part of the root pnpm workspace.

## Local Pages-equivalent build

From the repository root, generate the approved release, install the isolated docs app with its frozen lockfile, then build:

```sh
pnpm release:local
pnpm --dir apps/docs install --frozen-lockfile
pnpm --dir apps/docs build
PUBLIC_SITE_BASE=/neobrui/ PUBLIC_SITE_URL=https://example.invalid/neobrui/ pnpm --dir apps/docs build
```

Preview with `pnpm --dir apps/docs preview`. The output is static and includes Starlight’s Pagefind index.

## Pagefind search accessibility guard

`src/components/Search.astro` is the supported Starlight `components.Search` override. It wraps the pinned `@astrojs/starlight` 0.41.9 default Search component and scopes one short-lived `MutationObserver` to its `#starlight__search` mount. Pagefind 1.5.2 dynamically creates `.pagefind-ui__search-input` with a `title` but no accessible name, so the observer copies the localized open-search button label to `aria-label` and disconnects as soon as the input exists. It preserves Pagefind’s title and placeholder and does not replace or fork the default search UI.

Keep the regression test in `tests/navigation.spec.js` and the full axe matrix active while upgrading Astro, Starlight, or Pagefind. Remove the override when the upstream generated input has a non-title accessible name in all supported browsers; first confirm the upgrade in root and `/neobrui/` builds and both search behavior and axe tests.

## Future activation guide

Before any publication, explicitly choose the owner/repository URL, review the private-alpha and manual accessibility boundaries, and add a deployment workflow in a separate authorized change. No workflow or credentials are included here.
