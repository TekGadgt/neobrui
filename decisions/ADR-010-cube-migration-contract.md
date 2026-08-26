# ADR-010: CUBE migration contract

Status: Accepted
Date: 2026-08-26
Acceptance scope: Neobrui's pre-consumer namespace, cascade, token interchange, composition, utility, package, evidence, and phased migration contract. This records architecture and API decisions only; implementation is pending and adopter work is not authorized.

## Decision

Neobrui adopts CUBE-primary terminology and boundaries. ITCSS-style ordering is an implementation detail, not a second architecture. The stable name is `neobrui`; the stable namespace family is `nbr`; public cascade layers are, in order, `nbr.tokens`, `nbr.compositions`, `nbr.utilities`, `nbr.blocks`, and `nbr.exceptions`.

The first stable Blocks are Surface, Button, and Field. Stack and Cluster are Compositions. Utilities are first-class, allowlisted, demand-gated, and budgeted. Exceptions are finite presentational deviations expressed through namespaced data attributes. Native pseudo-classes and ARIA state remain owned by Blocks; product selectors own application context and theme state.

This is one atomic, pre-consumer break. Existing `_nb-spike` names are evidence history, not compatibility aliases, and must not be supported indefinitely.

## Supersedes and references

This contract accepts and refines the CUBE-primary recommendation in [`docs/cube-css-fit-review.md`](../docs/cube-css-fit-review.md), and supersedes the unresolved proposal language in [`ADR-009-architecture-proposal.md`](ADR-009-architecture-proposal.md). The review and proposal remain linked as decision input. Related boundaries are [`ADR-008-personal-use-positioning.md`](ADR-008-personal-use-positioning.md), [`docs/current-surface.md`](../docs/current-surface.md), and [`docs/expansion-roadmap.md`](../docs/expansion-roadmap.md).

## Complete naming map

| Concern | Old evidence name | Stable contract | Migration rule |
|---|---|---|---|
| Project/package identity | `neobrui-spike-0-harness`, private spike archive | `neobrui`, npm package remains private and unpublished | Rename only in Phase 4 package work; no registry publication. |
| Surface class | `._nb-spike-surface` | `.nbr-surface` | Atomic replacement; no alias. |
| Button class | `._nb-spike-button` | `.nbr-button` | Atomic replacement; no alias. |
| Field class | `._nb-spike-field` | `.nbr-field` | Atomic replacement; no alias. |
| Stack composition | none | `.nbr-stack` | New only in Phase 3. |
| Cluster composition | none | `.nbr-cluster` | New only in Phase 3. |
| Visually hidden utility | none | `.nbr-u-visually-hidden` | New only in Phase 3. |
| Wrapper utility | none | `.nbr-u-wrapper` | New only in Phase 3. |
| Surface level | `data-_nb-level="quiet\|outlined\|raised"` | `data-nbr-level="quiet\|outlined\|raised"` | Presentational Exception; same finite values. |
| Fixed shadow direction | `data-_nb-shadow-direction="fixed"` | `data-nbr-shadow-direction="fixed"` | Presentational Exception; only value `fixed`. |
| Field description organization | `data-_nb-description` | `data-nbr-description` | Organizational hook in Field, not an Exception. |
| Field error organization | `data-_nb-error` | `data-nbr-error` | Organizational hook in Field, not an Exception. |
| Theme selector in fixtures | hard-coded `[data-_nb-theme="…"]` | product-configured selector manifest; `data-nbr-theme` is not library-owned | Fixtures migrate to configured product selectors; the generator consumes mappings. |
| Custom properties | `--_nb-*` | `--nbr-*` | Normalize token paths and camelCase as specified below. |
| Layers | `neobrui.tokens`, `neobrui.recipes` | `nbr.tokens`, `nbr.compositions`, `nbr.utilities`, `nbr.blocks`, `nbr.exceptions` | Standalone entries declare only their owning layer; aggregate entries declare the full ordered list. |
| Recipe terminology | Surface/Button/Field recipes | Surface/Button/Field Blocks | Conceptual rename; preserve native markup and behavior. |
| Recipe aggregate | `src/recipes/index.css` | aggregate Blocks entry `dist/index.css` | No behavior change while migrating the source entry. |
| Test vocabulary | spike, recipe, fixture assertions | contract, Block, Composition, Utility, Exception, acceptance evidence | Historical evidence can retain old terms when clearly dated; normative tests cannot. |
| Evidence vocabulary | Spike 2/3/4/5/6 | migration, DTCG, composition, utility, neutral-site, release evidence | Rename normative headings and identifiers atomically. |

No indefinite `_nb-spike` alias layer, selector, variable, or package export exists. A consumer that has not yet adopted the current evidence names receives only the stable names after Phase 1.

### Package entry map

| Current evidence entry | Stable entry after Phase 4 | Contents |
|---|---|---|
| `@neobrui/private-spike-candidate` / `.` | `neobrui` / `.` | aggregate `dist/index.css` |
| `@neobrui/private-spike-candidate/foundations` | `neobrui/tokens` | generated token CSS |
| `@neobrui/private-spike-candidate/surface` | `neobrui/blocks/surface` | Surface Block CSS |
| `@neobrui/private-spike-candidate/button` | `neobrui/blocks/button` | Button Block CSS |
| `@neobrui/private-spike-candidate/field` | `neobrui/blocks/field` | Field Block CSS |
| `@neobrui/private-spike-candidate/recipes` | `neobrui/blocks` | aggregate Block CSS |
| none | `neobrui/compositions/stack` | Stack Composition CSS |
| none | `neobrui/compositions/cluster` | Cluster Composition CSS |
| none | `neobrui/utilities/visually-hidden` | visually-hidden Utility CSS |
| none | `neobrui/utilities/wrapper` | wrapper Utility CSS |
| none | `neobrui/tokens.dtcg.json` | generated DTCG interchange artifact |

These are planned stable package exports, not current package behavior. They are introduced only in Phase 4 after the prior phase gates pass; the Phase 1 migration changes source and fixture names without publishing or changing package metadata.

## Stable selectors and attributes

The exact public class selectors are `.nbr-surface`, `.nbr-button`, `.nbr-field`, `.nbr-stack`, `.nbr-cluster`, `.nbr-u-visually-hidden`, and `.nbr-u-wrapper`. Classes are global, opt-in, low-specificity selectors. No modifier naming scheme is public.

Presentational Exceptions are exactly:

- `[data-nbr-level="quiet"]`, `[data-nbr-level="outlined"]`, and `[data-nbr-level="raised"]` on `.nbr-surface`.
- `[data-nbr-shadow-direction="fixed"]` on `.nbr-surface` or `.nbr-button`, or on an ancestor for the documented scoped behavior.

The finite values above are validated; unknown values have no defined visual effect and are build/test errors when generated by a fixture. No data attribute is used to emulate `:hover`, `:active`, `:focus-visible`, disabled, busy, invalid, or selected state.

Field organizational attributes are `[data-nbr-description]` and `[data-nbr-error]`. They identify content relationships in the Field layout and are not visual Exceptions. The application must still provide native `label`, `id`/`for`, `aria-describedby`, and `aria-errormessage`/`aria-invalid` relationships as appropriate.

## State ownership

| State or behavior | Owner | Contract |
|---|---|---|
| Keyboard focus and `:focus-visible` | native browser + Block presentation | Blocks style focus; they do not create focus. |
| Hover and press | native pseudo-classes + Block | No data-state replacement. |
| Disabled control | native `disabled` + product semantics | `[aria-disabled="true"]` may style a button-like link, but the product prevents activation. |
| Busy | product state via `aria-busy="true"` | Block may present progress cursor; application manages work and announcements. |
| Invalid | native constraint validation/product via `aria-invalid="true"` | Field presents the state; application owns validation and message content. |
| Labels, descriptions, errors | native HTML/ARIA + product | Field only styles organizational hooks. |
| Theme toggle, selected theme, persistence | product | Generator maps configured selectors; Neobrui has no toggle or runtime state machine. |
| RTL/writing mode | document/product direction + CSS logical properties | Blocks and Compositions respond; product sets direction/context. |
| Reduced motion and forced colors | user agent media features + Block | CSS adapts without application state. |

## Custom properties

Every library custom property begins `--nbr-`. Token paths use lowercase kebab-case segments: `surfaceRaised` becomes `surface-raised`, `onAction` becomes `on-action`, and `pressInline` becomes `press-inline`. The normalization algorithm inserts a hyphen at lower/digit-to-uppercase and acronym-to-word boundaries, lowercases ASCII letters, converts separators (`_`, `.`, whitespace, `/`) to one hyphen, and rejects empty or non-ASCII segments rather than guessing.

Examples: `color.textMuted` → `--nbr-color-text-muted`; `shadow.pressInline` → `--nbr-shadow-press-inline`; `controlPadInline` → `--nbr-control-pad-inline`. Local component hooks are also namespaced, for example `--nbr-stack-gap`, `--nbr-cluster-align`, `--nbr-cluster-justify`, `--nbr-wrapper-max-inline-size`, and `--nbr-wrapper-padding-inline`.

After normalization, a collision is an error, not last-write-wins: `textMuted` and `text-muted` cannot coexist in one emitted namespace. Reserved top-level segments are `tokens`, `compositions`, `utilities`, `blocks`, and `exceptions`; source paths that collide with reserved output names are rejected. CSS values are validated by the existing finite schema plus each API's boundaries; arbitrary raw palette values are not a public per-instance API.

## Themes and fixtures

Theme state and selectors belong to the product. The build receives a product-owned manifest such as `{ theme: "dark", selector: ".site-dark" }` and emits the complete resolved theme under that selector; it does not choose a toggle, persistence mechanism, or application state attribute. A separate product selector manifest/sidecar is required and is not part of library token CSS. Fixtures must stop hard-coding internal theme selectors and instead exercise the configured manifest. A fixture may use `data-theme`, a class, or another product selector; it must not imply that `data-nbr-theme` is required.

Resolved theme maps are complete before CSS or DTCG output. Authoring inheritance is optional convenience only, resolved before validation; missing roles, unresolved aliases, and cycles fail the build.

## Cascade and source organization

The dependency graph is:

```text
canonical token maps
  └─> nbr.tokens
       ├─> nbr.compositions (Stack, Cluster)
       ├─> nbr.utilities (allowlisted utilities)
       └─> nbr.blocks (Surface, Button, Field)
              └─> nbr.exceptions (finite presentational deviations)
```

`nbr.exceptions` may be layered in the owning Block/Composition file when an Exception is inseparable from that API. A separate Exception file is justified only when it has independent validation, ownership, and package evidence. CUBE does not require folders: source organization follows ownership and entry boundaries, not a prescribed directory tree. Existing source may be reorganized into `tokens`, `compositions`, `utilities`, and `blocks` when Phase 1 implementation begins; generated output must retain the five public layers.

Standalone entries import tokens and their owning rules only. The aggregate entry declares the ordered layer list and includes all selected entries. No entry may create an implicit dependency on a later layer, and consumer unlayered CSS remains able to override normal library rules.

## Stack and Cluster API

Stack is a vertical flow: `.nbr-stack { display: flex; flex-direction: column; gap: var(--nbr-stack-gap, var(--nbr-space-4)); }`. Its default semantic spacing role is `space-4` (the existing 1rem role). The only public local hook is `--nbr-stack-gap`; accepted values are a finite CSS `<length-percentage>` or `normal` only when the implementation's validator explicitly supports it, with non-negative values required and CSS-wide keywords rejected. Stack does not reset child margins, reorder children, or create horizontal overflow.

Cluster is a wrapping inline flow: `.nbr-cluster { display: flex; flex-wrap: wrap; gap: var(--nbr-cluster-gap, var(--nbr-space-3)); align-items: var(--nbr-cluster-align, center); justify-content: var(--nbr-cluster-justify, flex-start); }`. Its default semantic spacing role is `space-3` (the existing 0.75rem role). Hooks are `--nbr-cluster-gap`, `--nbr-cluster-align`, and `--nbr-cluster-justify`. Gap is non-negative `<length-percentage>`; alignment accepts the validated `align-items` keyword subset (`start`, `center`, `end`, `stretch`, `baseline`, and safe/unsafe forms where supported); justification accepts the validated `justify-content` subset (`start`, `center`, `end`, `space-between`, `space-around`, `space-evenly`, and safe/unsafe forms where supported). Invalid values fail authoring validation rather than generating fallback matrices.

Both compositions use logical sizing/alignment where relevant, nest without leaking hooks to descendants, wrap long content, and remain usable at 320px. They must be tested in RTL and vertical writing modes, with long unbroken content and nested instances. No modifier classes, breakpoint variants, per-gap utility matrix, or alignment utility explosion is permitted.

## Utility contracts

`nbr-u-visually-hidden` clips an element to a 1px box, removes it from visual flow while preserving it in the accessibility tree, and uses the established absolute/overflow/clip-path pattern. It must not use `display:none`, `visibility:hidden`, or `!important`. The default contract is non-focusable content: focusable elements are not made visually hidden by this utility. A separate focus-reveal behavior is not in MVP; authors must use a visible skip-link pattern or product-owned reveal selector when focus visibility is required.

`nbr-u-wrapper` centers content with `inline-size: 100%`, `max-inline-size: var(--nbr-wrapper-max-inline-size, var(--nbr-size-content))`, and logical inline padding `var(--nbr-wrapper-padding-inline, var(--nbr-space-4))`. Defaults are the existing content-size token and `space-4`; both hooks accept non-negative `<length-percentage>` values, with max size additionally requiring a finite positive bound. It does not impose block padding, reset margins, or own application gutters.

A Utility is admitted only when it performs one job, has repeated consumer evidence, has a finite API, preserves native semantics, has a focused test and full browser coverage, and fits the budget. Remove a Utility when demand disappears, it duplicates a Composition/Block, needs a modifier matrix, requires `!important`, or exceeds its budget without demonstrated value.

| Utility | Initial minified budget | Gzip budget | Evidence required |
|---|---:|---:|---|
| `nbr-u-visually-hidden` | 700 B | 350 B | keyboard/accessibility and 320px checks |
| `nbr-u-wrapper` | 700 B | 350 B | responsive, RTL/writing-mode and long-content checks |
| Utility layer total | 1,200 B | 600 B | demand record, deterministic size report, full matrix |

Budgets are admission/removal gates, not a license to generate unused variants.

## DTCG 2025.10 interchange contract

The canonical editable source remains the validated JS/TS token and theme maps. The build deterministically generates CSS and DTCG 2025.10 JSON; generated JSON is never edited as a second source. The supported subset is pinned to DTCG 2025.10 and includes token groups, `$value`, `$type`, aliases/references, and configured per-theme organization.

A token object has `$value` and may have `$type`; groups contain nested token objects and groups. `$type` is inherited by descendants unless overridden by a supported explicit type. Aliases use the supported DTCG reference syntax and must resolve without cycles. Source paths are escaped deterministically before output; normalized-path collisions fail, as do invalid identifiers, missing required roles, unknown types, and unresolved references. Unknown DTCG properties/extensions are rejected by default with a clear diagnostic; an explicitly configured import mode may preserve unknown extension keys in a non-authoritative provenance sidecar, but never silently changes CSS.

Artifacts are organized per resolved theme (`tokens/<theme>.json` and corresponding CSS), with shared canonical role metadata where useful. The product selector manifest/sidecar is separate from token artifacts. Ordering is lexicographic by normalized path, encoding is UTF-8, newlines are LF, and files end with exactly one newline. Provenance records source path(s), generator version, DTCG pin, and source revision when available. Generated output is reproducible byte-for-byte.

Import is bounded to the supported subset. Round-trip means supported DTCG → validated internal map → deterministic DTCG preserves values, types, aliases, groups, and theme organization; provenance may change only in explicitly documented generated fields. CSS equivalence tests resolve every theme role and compare generated custom-property declarations to the canonical map. Package exports expose the generated CSS and DTCG artifacts only after Phase 4 package work. Build-time interchange JSON is not CSS runtime-loaded data; its bytes and generation cost are measured separately from CSS size.

## Package and artifact graph

```text
src/tokens/*.mjs (canonical)
  ├─> generated/tokens/<theme>.css       (@layer nbr.tokens)
  ├─> generated/dtcg/<theme>.json        (DTCG 2025.10)
  └─> generated/dtcg/manifest.json       (provenance + product selector sidecar)

src/compositions/*.css ─> dist/compositions/{stack,cluster}.css
src/utilities/*.css    ─> dist/utilities/{visually-hidden,wrapper}.css
src/blocks/*.css       ─> dist/blocks/{surface,button,field}.css
all selected entries    ─> dist/index.css (aggregate five-layer declaration)
all dist + generated artifacts ─> deterministic GitHub-first archive
```

The package is named `neobrui`, remains npm-private/unpublished, and has no registry credentials or publication configuration. Eventual source posture is MIT. Releases use deterministic GitHub-first archives, semantic `0.x` versions, retained prior assets, and checksums. No release or license file is created by this documentation-only phase.

## Phases, acceptance, rollback, and stop conditions

1. **Phase 1 — namespace/layer/Block migration.** Replace disposable names atomically, introduce the five layer contract, and rename recipes to Blocks without changing visual/native behavior. Accept only after existing fixtures/tests and diff inspection prove no behavior/API/package change beyond the agreed names. Roll back by reverting the single migration commit; stop on any selector, token value, or native-state drift.
2. **Phase 2 — DTCG and theme authoring.** Add the pinned exporter/import subset, complete-map validation, product selector manifest, aliases/types, equivalence, deterministic output, provenance, and separate size accounting. Accept only with byte-stable output and bounded round-trip evidence. Roll back by removing generated/interchange work while retaining the accepted namespace contract; stop on ambiguity or silent unknown-feature handling.
3. **Phase 3 — Compositions/Utilities/neutral site.** Implement Stack, Cluster, the two Utilities, their budgets, and the neutral executable site. Accept with full Chromium/Firefox/WebKit coverage, responsive/RTL/writing-mode/keyboard evidence, and demand records. Roll back each new entry independently; stop and remove it if it needs a matrix, `!important`, or misses its budget.
4. **Phase 4 — package/license/version/release artifact.** Add MIT posture, package exports, deterministic archive/checksum, and semantic `0.x` release metadata only after the prior phases pass. Accept with archive reproducibility, package-boundary, provenance, size, and clean-tree checks. Roll back by selecting the prior retained archive/tag; never rewrite history.

Only after all four phases pass may adopter work begin: first the neutral site (Phase 3 evidence), then a separately authorized bounded HTML Day Lite slice. Personal-site work is explicitly excluded. Any failed acceptance gate, unbounded compatibility request, or missing product decision is a stop condition rather than an implicit scope expansion.

## Documentation and evidence policy

Normative docs, tests, fixtures, package exports, and current-surface references must use stable `nbr` names and accepted CUBE vocabulary. Historical evidence may retain `_nb-spike` names only when clearly labeled as historical and not presented as a current selector or contract. Links should point to ADR-010 for accepted decisions and explicitly distinguish accepted-but-unimplemented work from observed behavior.

This ADR changes documentation only. It does not change CSS, selectors, tokens, package behavior, generated artifacts, or adopter projects.
