# Spike 6B timed QA-matrix rehearsal

Date: 2026-08-26 UTC
Repository: `/workspace/neobrui`
Starting and ending commit: `17fda71` (`test: strengthen Spike 6 accessibility evidence`)

## Scope and commands

This was run alone on clean committed `main`; no product or harness source was changed. Commands run:

- `pnpm install --frozen-lockfile`
- `pnpm qa:baseline`
- `pnpm qa:seeded`
- `pnpm qa:baseline` (clean retest after seeded run)
- `pnpm verify:clean`
- `git status --short --branch`
- process inspection for Vite/Playwright/production-fixture residue

The harness generated ignored `.qa-rehearsal/` reports and browser-labelled screenshots. The committed evidence is this report, `evidence/qa-timings.json`, and `evidence/spike-6-screenshot-manifest.json`; generated cache is not committed.

## Environment

- Debian GNU/Linux 13.4 (trixie), Linux kernel `6.8.0-117-generic`, `aarch64`
- Node `v26.5.1`; pnpm `11.24.0`
- Vite `7.3.6`; Playwright `1.62.1`; `@axe-core/playwright` `4.13.0`; gzip `1.13`
- Playwright bundles present: Chromium `1234`, Firefox `1538`, WebKit `2336`
- Windows, macOS, Windows High Contrast, NVDA, VoiceOver, physical keyboard/touch devices, and true browser UI zoom at 200% were unavailable. They were not simulated.

## Timed execution

Wall-clock command timings are kept separate from human/manual work:

| Stage | Measured |
|---|---:|
| frozen install | 1.125 s |
| green baseline before seeds | 12.123 s |
| seeded rehearsal (12 runs) | 26.330 s |
| green baseline after seeds | 12.123 s |
| canonical `pnpm verify:clean` | 56.102 s |
| timed human investigation | not measured |
| timed documentation | not measured |
| hardware/manual elapsed | manual-unavailable |

The report-level automated stages included clean setup, token/unit/size checks, seed generation, each browser/variant runtime, and cleanup/retest. The final clean baseline was rerun after the seeded run and passed.

## Results and detector matrix

Green baseline passed before and after the seeded rehearsal: 3/3 engines each time, zero failures.

The seeded matrix passed 12/12: 4 variants across Chromium, Firefox, and WebKit, zero false positives and zero duplicate detections.

| Seed | Intended layer | Expected finding | Result |
|---|---|---|---|
| missing-label | native semantic association + supplemental axe `label` violation | missing-label | detected exactly |
| clipping-320 | document/main overflow assertion at 320 CSS px | clipping-320 | detected exactly |
| shadow-only-focus | focus-visible outline and box-shadow loss under test-controlled no-shadow fallback + screenshot | shadow-only-focus | detected exactly |
| combined | union of all three detector layers | all three findings | detected exact union |

The missing-label run produced both the missing native association and supplemental axe `label` evidence; baseline and unrelated seeds asserted no axe `label` violation. Clipping produced no axe violation (it is a geometry detector); shadow-only-focus was classified by outline and box-shadow computed checks under the test-controlled no-shadow fallback, plus screenshot. All reports recorded `falsePositives: []` and `duplicateDetections: []`.

## Screenshot visual review

I inspected these generated screenshots as a human visual review, recording only pixel-visible observations:

- `.qa-rehearsal/chromium-combined-chromium.png`: the 480px panel content visibly extends beyond the 320px viewport; the email field is visibly presented without a label text preceding it; no visible focus ring is present on the Continue button in this captured state.
- `.qa-rehearsal/firefox-shadow-only-focus-firefox.png`: the panel and controls are visible at 320px; the button is visibly below the email field; no clear outline/ring is visible around the focused button.

Screenshots do not establish semantics, assistive-technology usability, hardware keyboard behavior, or actual OS high-contrast behavior. The screenshots are generated evidence and remain ignored runtime output; the manifest identifies them without copying generated cache into the commit.

## Keyboard and manual matrix

Automated keyboard coverage passed: `tests/recipes.spec.js` presses `Tab` and asserts the expected button focus order; the full matrix also passed the shadow keyboard-focus test in Chromium, Firefox, and WebKit. This is a Playwright keyboard automation result, not a human hardware-keyboard pass.

Manual hardware keyboard, Windows High Contrast, NVDA + Firefox/Chrome, VoiceOver + Safari, physical touch/device, and true browser UI zoom at 200% are `manual-unavailable`. No unavailable cell is marked passed.

## Checklists

Statuses use only the canonical vocabulary (`passed`, `failed`, `manual-unavailable`, `not-triggered`, `not-run`). The structural test requires these IDs and values to match `evidence/qa-checklists.md` and `evidence/qa-timings.json` exactly:

- PR-1 `passed`; PR-2 `manual-unavailable`; PR-3 `manual-unavailable`.
- RC-1 `passed`; RC-2 `manual-unavailable`; RC-3 `manual-unavailable`.
- AUD-1 `passed`; AUD-2 `manual-unavailable`; AUD-3 `manual-unavailable`.
- SLICE-1 `passed`; SLICE-2 `manual-unavailable`.

Machine-readable evidence and rationale are in `evidence/qa-timings.json`.

## Canonical verification and cleanup

Final `pnpm verify:clean` passed:

- frozen install and all fixture builds passed;
- token schema: 5 passed;
- Node/unit suite: 10 passed, 0 failed;
- full Playwright matrix: 141 passed, 2 intentional skips, 0 failed, across Chromium/Firefox/WebKit;
- Chromium capture: 45 passed, 2 intentional skips, 0 failed;
- size verification passed;
- bounded preview teardown passed with no owned preview process;
- final green `pnpm qa:baseline`: 3/3 engines passed;
- final tree check: clean after the evidence commit, with no Vite/Playwright/fixture processes remaining.

## Defect log, latency, false positives, and retest

All three individual seeds and the combined seed were detected on the first intended-layer run in each engine. Exact per-run wall-clock runtimes are present in the ignored `.qa-rehearsal/report.json` generated during the rehearsal; aggregate command time was 23.822 seconds. Detection latency is therefore recorded as automated run wall-clock, not human elapsed investigation. No duplicate detections or false positives occurred. The post-seed clean baseline was the retest and passed on all three engines.

## Capacity and support decision

The measured automation is far below the provisional human targets, but it cannot validate human elapsed estimates. PR human review/investigation remains a provisional 10–25 minute target with low confidence; RC remains 60–120 minutes with low confidence; quarterly/full audit remains 3–5 hours but is explicitly unvalidated. A complete quarterly estimate is not inferred from Linux automation.

Decision: keep the private three-recipe pilot. Make no public package/support promise. Do not claim Windows High Contrast, NVDA, VoiceOver, physical-device, or true-zoom support until real manual runs exist. Integration-specific support claims remain excluded until sustainable capacity and manual coverage are available.
