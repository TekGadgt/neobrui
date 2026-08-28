# Neobrui evidence rubric

This rubric records the clean scaffold's current review score; screenshot capture is opt-in and is not part of normal CI.

| Identity | Score | Accessibility | Responsive | Interaction |
| --- | ---: | ---: | ---: | ---: |
| Neutral | 17/18 | Pass: keyboard focus and axe on representative main content | Pass: 320px no overflow | Pass: native links/buttons and Search focus return |
| Product mapping | 17/18 | Pass: same semantics under scoped role mapping | Pass: logical layout collapse documented | Pass: same controls and removable classes |

Dimensions scored: hierarchy, intentional irregularity, restraint, semantic roles, responsive layout, native interaction, accessibility, product identity, and removability. Observations and machine-readable scores are in `rubric.json`.

## Current capture observations

The eight Chromium captures in `screenshots/` show the same authored Patterns specimen at 1280px and exact 320px widths in both color schemes. Desktop preserves the two-column gallery and large editorial lead; mobile collapses each specimen to one column without horizontal clipping. Light and dark captures retain visible borders, readable text, focus-capable native links/buttons, and distinct product mapping content. The capture contract asserted HTTP 200, the Patterns H1, identity markers, no error responses, and the requested viewport/theme before writing each PNG; each manifest hash was generated from its corresponding file.
