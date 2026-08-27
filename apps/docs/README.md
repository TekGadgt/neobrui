# Neobrui documentation

This private Astro Starlight site consumes the authored Neobrui CSS directly from `src/`; it does not generate, extract, or stage a package copy.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter neobrui-docs check
pnpm --filter neobrui-docs build
PUBLIC_SITE_BASE=/neobrui/ PUBLIC_SITE_URL=https://tekgadgt.github.io/neobrui/ pnpm --filter neobrui-docs build
```

The Pages build is the same docs build with `/neobrui/` as its base and uploads only `apps/docs/dist`. Use the project Playwright config after building to exercise Chromium, Firefox, and WebKit.
