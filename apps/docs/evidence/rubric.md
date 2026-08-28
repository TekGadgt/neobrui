# Neobrui evidence rubric

This rubric records the clean scaffold's current review score; screenshot capture is opt-in and is not part of normal CI.

| Identity | Score | Accessibility | Responsive | Interaction |
| --- | ---: | ---: | ---: | ---: |
| Neutral | 17/18 | Pass: keyboard focus and axe on representative main content | Pass: 320px no overflow | Pass: native links/buttons and Search focus return |
| Product mapping (Coral Ledger) | 17/18 | Pass: same native semantics under an explicit scoped role mapping; light foreground/background contrast verified at >=4.5:1 | Pass: same 1280px/320px route and dimensions; mobile specimens reflow without clipping | Pass: same native button/link anatomy and removable scope |

Dimensions scored: hierarchy, intentional irregularity, restraint, semantic roles, responsive layout, native interaction, accessibility, product identity, and removability. Observations and machine-readable scores are in `rubric.json`.

## Current capture observations

The four neutral captures remain byte-for-byte unchanged at the manifest hashes `40c060…`, `263375…`, `b6f511…`, and `6b923a…`. The four regenerated Coral Ledger product captures use the same `/patterns/` route, 1280px/320px viewports, and light/dark schemes, but differ from every paired neutral hash (`1a21b69…`, `ef4cd81…`, `133d98f…`, `dfa145c…`).

Product identity is opt-in on the product specimen root via `data-nbr-example-theme="product"` and the accessible `aria-label="Product identity: Coral Ledger"`. Its ink-navy/warm-cream mapping, coral action, teal shadow/focus, 3–4px borders, 0.65rem controls, and 5–6px shadows are explicit light/dark values; neutral capture removes the opt-in scope before rendering. Manifest records contain the computed role snapshot and marker for each product image, and the contract rejects duplicate hashes while requiring light/dark token snapshots to differ.

Visual inspection found a clear cream/navy product panel in light mode and navy product panel with warm light text in dark mode. Desktop preserves the gallery and product panel without overflow; mobile stacks all specimens and keeps text/buttons readable. Borders and shadows remain restrained, no 404/error responses were observed, and no clipping was visible.
