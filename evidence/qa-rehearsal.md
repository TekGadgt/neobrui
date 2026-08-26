# Spike 6A QA rehearsal

Run `pnpm qa:baseline`, `pnpm qa:seeded`, or `pnpm qa:rehearsal`. Each writes ignored `.qa-rehearsal/report.json`, per-run JSON, and browser-labelled screenshots. The report schema is `neobrui.qa-rehearsal/v1`; run records use `neobrui.qa.run/v1` and include monotonic `durationMs` values, detector findings, false positives, duplicate detections, axe violations, and forced-colors capability labels.

Seeds are generated only at runtime:

| seed | transformation | intended detector |
|---|---|---|
| `missing-label` | removes the `for` association | semantic association and axe |
| `clipping-320` | adds deterministic 480px content | 320px overflow/clipping |
| `shadow-only-focus` | removes outline and shadow fallback | computed focus-visible and no-shadow fallback |
| `combined` | all three transformations | all three, and no unrelated finding |

The Linux environment cannot complete real Windows High Contrast, NVDA + Firefox/Chrome on Windows, VoiceOver + Safari on macOS, physical keyboard/touch-device checks, or true browser UI zoom at 200%. These remain `unavailable` until real access exists; no versions or results are invented.

## Operator checklists

Every row must use one status: `automated`, `manual`, `unavailable`, or `not triggered`, and provide an evidence path and rationale.
