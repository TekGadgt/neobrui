# QA checklist templates

Use this row schema in each checklist: `id | behavior | status | evidence path | rationale`.

## PR

| id | behavior | status | evidence path | rationale |
|---|---|---|---|---|
| PR-1 | baseline and seeded rehearsal | automated | `.qa-rehearsal/report.json` | all applicable engines classify expected findings |
| PR-2 | manual AT review | unavailable | — | Linux has no real Windows/macOS AT |
| PR-3 | keyboard/touch hardware | unavailable | — | no physical devices in harness |

## Release candidate

| id | behavior | status | evidence path | rationale |
|---|---|---|---|---|
| RC-1 | full `pnpm verify:clean` | automated | `evidence/playwright-results.json` | canonical matrix and clean-tree checks |
| RC-2 | real forced colors | unavailable | — | OS High Contrast access is unavailable |
| RC-3 | 200% browser UI zoom | unavailable | — | root text sizing is not browser UI zoom |

## Quarterly/full audit

| id | behavior | status | evidence path | rationale |
|---|---|---|---|---|
| AUD-1 | all three engines and seeds | automated | `.qa-rehearsal/report.json` | repeatable detector rehearsal |
| AUD-2 | NVDA/VoiceOver | unavailable | — | requires real Windows/macOS sessions |
| AUD-3 | user evidence | manual | — | operator must attach actual user evidence |

## Affected behavior slice

| id | behavior | status | evidence path | rationale |
|---|---|---|---|---|
| SLICE-1 | changed detector | not triggered | — | mark automated when affected |
| SLICE-2 | related manual review | manual | — | operator records real review or explains why not run |
