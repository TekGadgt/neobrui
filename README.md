# Neobrui

## Package status

Release candidate `@tekgadgt/neobrui@0.1.0-alpha.0` is prepared for the `next` channel, but it is not currently published or available from the npm registry. Publication remains pending explicit human approval.

Neobrui is a small, reset-free, opt-in CSS design system for native HTML. It ships authored CSS only: importing it does not restyle bare elements and it has no browser-runtime JavaScript or assets.

## API

```css
/* After publication: */
@import '@tekgadgt/neobrui';
```

Use `.nbr-stack`, `.nbr-cluster`, `.nbr-wrapper`, and `.nbr-grid` for layout; `.nbr-surface` with `data-nbr-level="quiet|outlined|raised"`; `.nbr-pressable` on native buttons and links; and `.nbr-u-visually-hidden` for accessible text. Product themes own identity and state.

## Local verification

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm --filter neobrui-docs check
pnpm --filter neobrui-docs build:root
PUBLIC_SITE_BASE=/neobrui/ PUBLIC_SITE_URL=https://tekgadgt.github.io/neobrui/ pnpm --filter neobrui-docs build:pages
pnpm --filter neobrui-docs test --project=chromium
PUBLIC_SITE_BASE=/neobrui/ pnpm --filter neobrui-docs test --project=firefox
PUBLIC_SITE_BASE=/neobrui/ pnpm --filter neobrui-docs test --project=webkit
npm pack
```

The repository uses pnpm 11.24.0. The Pages workflow builds with `/neobrui/` and uploads only `apps/docs/dist`; it does not publish the package. See `docs/design-system/migration-and-deletion.md` for the current boundary and maintainer flow.
