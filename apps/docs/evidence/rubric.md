# Neobrui evidence rubric

This rubric records the expanded developer-reference page's current review score; screenshot capture is opt-in and is not part of normal CI.

| Identity | Score | Accessibility | Responsive | Interaction |
| --- | ---: | ---: | ---: | ---: |
| Neutral | 17/18 | Pass: keyboard focus and axe on representative main content | Pass: 320px no overflow | Pass: native links/buttons and Search focus return |
| Product mapping (Coral Ledger) | 17/18 | Pass: same native semantics under an explicit scoped role mapping; light/dark foreground/background contrast verified at >=4.5:1 | Pass: same 1280px/320px route and dimensions; mobile specimens reflow without clipping | Pass: same native button/link anatomy and removable scope |

Dimensions scored: hierarchy, intentional irregularity, restraint, semantic roles, responsive layout, native interaction, accessibility, product identity, and removability. Observations and machine-readable scores are in `rubric.json`.

## Current capture observations

The eight current captures are `/patterns/` at 1280px/320px and light/dark schemes. Neutral hashes are `320594…`, `9be2d1…`, `82136a…`, and `4d5781…`; paired Coral Ledger hashes are `e47690…`, `38093d…`, `b6e221…`, and `353730…`. Every paired hash is distinct and all eight hashes are unique.

Each specimen contains the same header, mixed-span surface grid, status span, navigation, toolbar, native links, and native buttons. The capture contract normalizes only the identity-specific marker and landmark labels before asserting identical anatomy/content; it also verifies matching paired dimensions. Product identity is opt-in on the product root via `data-nbr-example-theme="product"` and the visible/accessible marker `Product identity: Coral Ledger`.

Visual review found readable neutral and cream/navy Coral Ledger panels in light mode, plus navy panels with warm light text in dark mode. Desktop preserves developer prose, code/table examples, and both specimens without overflow; mobile stacks the grids and keeps text/buttons readable. Borders and shadows remain restrained, no 404/error responses were observed, and no clipping was visible.
