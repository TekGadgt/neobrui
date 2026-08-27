# Neobrui

Neobrui is a centralized, public, opt-in Neobrutalism design system for native HTML. It is directly authored CSS: importing it does not reset or restyle bare elements, and it ships zero browser-runtime JavaScript or assets.

## API

```css
@import 'neobrui';
```

Use `.nbr-stack`, `.nbr-cluster`, `.nbr-wrapper`, and `.nbr-grid` for layout; `.nbr-surface` with `data-nbr-level="quiet|outlined|raised"`; `.nbr-pressable` on native buttons and links; and `.nbr-u-visually-hidden` for accessible visually hidden content. See `docs/design-system/0001-centralized-neobrui-reset.md` and the docs site for the complete contract.

Semantic roles and border/shadow/press geometry are custom properties, with neutral system-color fallbacks and logical writing-mode-aware shadows. Product themes own identity. Forced colors remove shadow reliance, and reduced motion disables press animation.

## Local verification

```sh
pnpm install --frozen-lockfile
pnpm test
npm pack --dry-run
pnpm --filter neobrui-docs build
```

The repository uses pnpm 11.24.0 and supports darwin/linux and arm64/x64 through the shared lockfile. No publish, deploy, or push is implied by local verification.
