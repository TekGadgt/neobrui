# Neobrui API lookup

Source: `src/foundations.css`, `src/layout.css`, `src/primitives.css`, `src/utilities.css`, and `package.json` exports. Core custom properties are neutral fallbacks; set them on a product/theme ancestor or one instance.

## Public classes

| Class | Required/native markup | Owns | Does not own | Responsive/state |
|---|---|---|---|---|
| `.nbr-stack` | Any semantic container | `display:flex`, column direction, `gap` | child margins, order, typography | none |
| `.nbr-cluster` | Group container; use native children | flex wrap, alignment, gap | semantics, child widths | wraps at all widths |
| `.nbr-wrapper` | page/content container | border-box, 100% inline size, max measure, auto inline margin, logical gutter | block padding, overflow | logical RTL-safe |
| `.nbr-grid` | meaningful source-order children | 12-column grid, gap, first span 7, second span 5 | intrinsic sizing, content order | all children one column at `40rem` |
| `.nbr-surface` | article/section/div for content | text, background, border, padding; level shadow | interaction/semantics | forced-colors removes shadow |
| `.nbr-pressable` | native `button` or `a[href]` | control geometry, colors, hover/active/focus visuals | behavior, disabled handling for `aria-disabled` | RTL, reduced-motion, forced-colors |
| `.nbr-u-visually-hidden` | accessible text/skip link | clipping and focus restoration | decorative hiding, application z-index | fixed focus restoration |

## Attributes

- `data-nbr-level="quiet|outlined|raised"` on `.nbr-surface`; missing/invalid means base surface only.
- `data-nbr-shadow-direction="fixed"` sets a physical positive inline raised offset on the element scope.
- `[dir="rtl"]` mirrors inline shadow/press sign.
- `[disabled]` and `[aria-disabled="true"]` style Pressable; only native `disabled` supplies button behavior.

## Custom properties

| Property | Default/source fallback | Consumer |
|---|---|---|
| `--nbr-color-canvas` | `Canvas` | product/app |
| `--nbr-color-surface` | `Canvas` | Surface |
| `--nbr-color-surface-raised` | `Canvas` | product/app |
| `--nbr-color-text` | `CanvasText` | Surface |
| `--nbr-color-text-muted` | `GrayText` | product/app |
| `--nbr-color-border` | `CanvasText` | Surface/Pressable |
| `--nbr-color-focus` | `Highlight` | Pressable |
| `--nbr-color-action` | `ButtonFace` | Pressable |
| `--nbr-color-on-action` | `ButtonText` | Pressable |
| `--nbr-color-shadow` | `CanvasText` | Surface/Pressable |
| `--nbr-border-width-structural` | `2px` | Surface |
| `--nbr-border-width-control` | `2px` | Pressable |
| `--nbr-border-style` | `solid` | Surface/Pressable |
| `--nbr-shadow-offset-small` | `2px` | Pressable |
| `--nbr-shadow-offset-raised` | `4px` | Surface/fixed |
| `--nbr-press-translation` | `2px` | Pressable |
| `--nbr-radius` | `0px` | Pressable |
| `--nbr-space-1` | `.25rem` | product |
| `--nbr-space-2` | `.5rem` | Pressable |
| `--nbr-space-3` | `.75rem` | Cluster |
| `--nbr-space-4` | `1rem` | Stack/Wrapper/Grid/Surface |
| `--nbr-content-measure` | `70rem` | Wrapper |
| `--nbr-motion-duration` | `160ms` | Pressable |

### Component hooks

`--nbr-stack-gap` → space-4; `--nbr-cluster-align` → center; `--nbr-cluster-justify` → flex-start; `--nbr-cluster-gap` → space-3; `--nbr-wrapper-max` → content measure; `--nbr-wrapper-gutter` → space-4; `--nbr-grid-columns` → 12; `--nbr-grid-gap` → space-4; `--nbr-grid-span` → 7; `--nbr-grid-span-secondary` → 5; `--nbr-surface-text` → color-text; `--nbr-surface-background` → color-surface; `--nbr-surface-border` → structural width/style/border; `--nbr-surface-padding` → space-4; `--nbr-surface-border-color` → color-border; `--nbr-shadow-inline` and `--nbr-shadow-block` → raised offset; `--nbr-shadow-color` → color-shadow; `--nbr-press-sign` → `1` (RTL changes it to `-1`); `--nbr-pressable-padding` → space-2/space-3; `--nbr-pressable-border` → control width/style/border; `--nbr-pressable-radius` → radius; `--nbr-pressable-text` → on-action; `--nbr-pressable-background` → action; `--nbr-press-inline` and `--nbr-press-block` → press translation.

Removal is safe when the application has not delegated required product declarations: remove the import/classes and native HTML remains.
