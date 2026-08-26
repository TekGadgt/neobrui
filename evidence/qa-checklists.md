# QA checklist templates

Use this row schema in each checklist: `id | behavior | status | evidence path | rationale`.
Canonical statuses are: `passed`, `failed`, `manual-unavailable`, `not-triggered`, `not-run`.

## PR

| id | behavior | status | evidence path | rationale |
|---|---|---|---|---|
| PR-1 | baseline and seeded rehearsal | passed | `.qa-rehearsal/report.json` | all applicable engines classify expected findings |
| PR-2 | manual AT review | manual-unavailable | — | Linux has no real Windows/macOS AT |
| PR-3 | keyboard/touch hardware | manual-unavailable | — | no physical devices in harness |

## Release candidate

| id | behavior | status | evidence path | rationale |
|---|---|---|---|---|
| RC-1 | full `pnpm verify:clean` | passed | `evidence/playwright-results.json` | canonical matrix and clean-tree checks |
| RC-2 | real forced colors | manual-unavailable | — | OS High Contrast access is unavailable |
| RC-3 | 200% browser UI zoom | manual-unavailable | — | root text sizing is not browser UI zoom |

## Quarterly/full audit

| id | behavior | status | evidence path | rationale |
|---|---|---|---|---|
| AUD-1 | all three engines and seeds | passed | `.qa-rehearsal/report.json` | repeatable detector rehearsal |
| AUD-2 | NVDA/VoiceOver | manual-unavailable | — | requires real Windows/macOS sessions |
| AUD-3 | user evidence | manual-unavailable | — | no operator user-evidence session was available |

## Affected behavior slice

| id | behavior | status | evidence path | rationale |
|---|---|---|---|---|
| SLICE-1 | changed detector | passed | `.qa-rehearsal/report.json` | affected seed rehearsal passed across all engines |
| SLICE-2 | related manual review | manual-unavailable | — | only automated visual screenshot inspection was possible |
