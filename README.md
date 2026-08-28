# Neobrui

Neobrui is a small, reset-free, opt-in CSS design system for native HTML. It ships authored CSS only: importing it does not restyle bare elements and it has no browser-runtime JavaScript or assets.

## API

```css
@import 'neobrui';
```

Use `.nbr-stack`, `.nbr-cluster`, `.nbr-wrapper`, and `.nbr-grid` for layout; `.nbr-surface` with `data-nbr-level="quiet|outlined|raised"`; `.nbr-pressable` on native buttons and links; and `.nbr-u-visually-hidden` for accessible text. Product themes own identity and state.

## Local verification

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm --filter neobrui-docs check
pnpm --filter neobrui-docs build
PUBLIC_SITE_BASE=/neobrui/ PUBLIC_SITE_URL=https://tekgadgt.github.io/neobrui/ pnpm --filter neobrui-docs build
npm pack
```

The repository uses pnpm 11.24.0. The Pages workflow builds with `/neobrui/` and uploads only `apps/docs/dist`; it does not publish the package. See `docs/design-system/migration-and-deletion.md` for the current boundary and maintainer flow.
