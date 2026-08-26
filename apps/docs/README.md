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

## Future activation guide

Before any publication, explicitly choose the owner/repository URL, review the private-alpha and manual accessibility boundaries, and add a deployment workflow in a separate authorized change. No workflow or credentials are included here.
