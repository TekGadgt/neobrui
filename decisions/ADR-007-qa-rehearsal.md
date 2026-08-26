# ADR-007: Deterministic QA rehearsal harness

Status: accepted

## Decision

Spike 6A uses `scripts/qa-rehearsal.mjs` to generate three independent, test-only HTML variants under ignored `.qa-rehearsal/`. `tests/qa-rehearsal.spec.js` runs each variant in Chromium, Firefox, and WebKit through the isolated `qa/playwright.config.js`, recording semantic/axe, 320 CSS px overflow, computed focus, forced-colors capability labels, and screenshots. The combined variant must produce exactly the union of the three intended findings.

The baseline is clean. A seeded run is successful only when its expected detector finds the defect; false positives and duplicate detections are separate report fields. Generated output is never copied into `src/`, `fixtures/`, `dist/`, package archives, or canonical evidence.

## Limitations

This Linux rehearsal does not claim real Windows High Contrast, NVDA with Firefox/Chrome, VoiceOver with Safari, physical keyboard/touch-device checks, or true browser UI zoom at 200%. WebKit forced-colors limitations are reported as a deterministic stylesheet-source fallback, not simulated operating-system evidence. Automated assertions, axe, and screenshots supplement but never replace manual assistive-technology, forced-colors, keyboard, zoom, or user-evidence review.
