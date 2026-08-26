# ADR-004: Logical RTL hard-shadow policy

Status: accepted for Spike 3 evidence only; disposable `_nb-spike-` recipes are not a public API.

## Decision

Raised Surface and Button use one diagonal hard shadow: inline-axis offset, block-axis offset, zero blur, and semantic `--_nb-color-shadow`. The temporary `shadow.inline`, `shadow.block`, `shadow.pressInline`, and `shadow.pressBlock` roles are axis lengths/remaining pressed offsets, not complete shadow declarations. Fixture-owned values are `3px`, `4px`, `1px`, and `1px` respectively; schema validation accepts finite CSS lengths and rejects colors or full shadow lists.

The logical default falls down and inline-end. CSS `:dir(rtl)` changes the inline offset and matching press translation to negative physical x while leaving block offset positive. This follows the nearest computed direction, including nested LTR in RTL and RTL in LTR. A subtree or control marked `data-_nb-shadow-direction="fixed"` explicitly opts into fixed physical down-right art direction in both directions. No arbitrary component direction prop is exposed.

Pressed Button state keeps the same border-box dimensions and reduces the shadow to the pressed offsets. The element translates by the matching delta toward the shadow; reduced motion removes translation but retains the active shadow cue. Shadow is decorative art direction, never the semantic or sole accessibility cue.

## Escape hatch and fallback

The fixed physical subtree attribute is the escape hatch for art-directed layouts that cannot use logical direction. The bounded nested-direction check passed in Chromium, Firefox, and WebKit, so fixed-only fallback was not activated. If a future browser matrix makes nearest-direction behavior unpredictable after one bounded revision, v1 must switch to fixed-physical-only and record that change rather than conceal ambiguity.

## Accessibility and removal

Borders, native focus-visible outlines, disabled opacity/border treatment, invalid dashed borders and correction text remain without shadow. Forced colors suppress shadows while preserving those cues. Remove this ADR and temporary recipes if the rubric is rejected or a future design-system implementation replaces them; no compatibility promise is made.
