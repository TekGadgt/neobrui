# Spike 6A QA rehearsal

Run `pnpm qa:baseline`, `pnpm qa:seeded`, or `pnpm qa:rehearsal`. Each writes ignored `.qa-rehearsal/report.json`, per-run JSON, and browser-labelled screenshots. The report schema is `neobrui.qa-rehearsal/v1`; run records use `neobrui.qa.run/v1` and include monotonic `durationMs` values, detector findings, false positives, duplicate detections, axe violations, semantic association observations, focus-cue details, and forced-colors capability labels.

Seeds are generated only at runtime:

| seed | transformation | intended detector |
|---|---|---|
| `missing-label` | removes the `for` association | native semantic association plus supplemental axe `label` violation |
| `clipping-320` | adds deterministic 480px content | 320px overflow/clipping |
| `shadow-only-focus` | removes outline and shadow fallback | focus-cue loss under a test-controlled no-shadow fallback condition |
| `combined` | all three transformations | all three, and no unrelated finding |

The Linux environment cannot complete real Windows High Contrast, NVDA + Firefox/Chrome on Windows, VoiceOver + Safari on macOS, physical keyboard/touch-device checks, or true browser UI zoom at 200%. These remain `manual-unavailable`; no versions or results are invented. Chromium/Firefox use Playwright forced-colors emulation where supported. WebKit is labelled exactly `stylesheet-source-fallback`, because this harness cannot claim WebKit forced-colors emulation or real OS High Contrast.

## Operator checklists

Every row uses one canonical status: `passed`, `failed`, `manual-unavailable`, `not-triggered`, or `not-run`, and provides an evidence path and rationale. The committed Markdown checklist, timing JSON, and summary report must agree exactly; `tests/qa-rehearsal.test.mjs` enforces IDs, statuses, and values.
