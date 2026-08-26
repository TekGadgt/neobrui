# Neobrui architecture and release options

Status: Accepted direction; implementation contract is [`ADR-010`](../decisions/ADR-010-cube-migration-contract.md). This paper preserves the alternatives and rationale; it is not the source of implementation-sensitive API details.

## Executive position

Neobrui (“neobrutalism UI”) is proposed as Ryan’s personal-use CSS kit first. The implementation gate should preserve the current narrow, CSS-only surface and add only the smallest approved primitives and interchange work. A public GitHub source, a supported library, and a competitive framework are separate gates—not consequences of making source visible.

### Accepted decision bundle

1. Keep the working name **neobrui**, subject to a concrete collision, trademark, or search finding.
2. Use the concise, project-owned `nbr-` namespace family consistently for classes, data attributes, custom properties, and cascade layers. Do not keep `_nb-spike` aliases as a compatibility promise.
3. Use a small ITCSS/CUBE hybrid: tokens/settings, compositions/layouts, recipes/blocks, and a deliberately tiny utility layer. Do not add a reset or generic element takeover.
4. Keep validated JS/TS token and theme maps as the initial canonical authoring source, and add a deterministic DTCG export as a first-class interchange surface. One editable source only.
5. Keep theme state and selectors in the product. Neobrui emits mappings for configured selectors and never creates a second toggle or state machine.
6. Model `Stack` and `Cluster` as layout compositions with namespaced custom-property hooks and token defaults, not a broad utility matrix. Add them only after approval and evidence.
7. Use GitHub tags and GitHub Release assets as the first distribution contract. Keep npm private and unpublished until separately authorized.
8. Sequence adoption as a neutral executable test site, then a bounded HTML Day Lite Surface/Button/Cluster slice with side-by-side rollback. Do not migrate the personal site at the same time.

Every item above is accepted as direction. The exact migration map, selector/attribute contracts, API boundaries, artifact graph, and phase gates live in ADR-010. Implementation remains pending.

## CSS architecture choices

ITCSS is best understood as a dependency/order model: broad, low-specificity rules precede narrower rules. It does not prescribe a class naming convention.[1] Utility-first is an API strategy—small composable classes are the consumer-facing vocabulary—not an ordering model. CUBE CSS emphasizes composition, utility, block, and exception concerns.[2]

| Option | Strengths | Costs and Neobrui fit |
|---|---|---|
| Full utility-first | Fast composition; consumers need few bespoke selectors; familiar in Tailwind ecosystems. | Large API surface, class-string verbosity, and pressure to generate a matrix before demand exists. Not proposed for the first kit. |
| BEM/SUIT-style components | Clear ownership and component boundaries; familiar block/element/modifier vocabulary.[3][4] | Can turn every variation into a named selector and encourages component naming decisions before the product contract is settled. Useful as a naming influence, not the whole architecture. |
| CUBE CSS | Separates layout/composition from blocks, utilities, and exceptions; supports context-aware styling.[2] | Requires discipline about where a rule belongs. Good conceptual fit for compositions plus recipes. |
| Pure ITCSS | Predictable cascade ordering and low-specificity layering.[1] | Says little about the consumer API, token roles, or primitive ergonomics. Too incomplete alone. |
| Token-first/custom-property API | Makes roles and overrides explicit; zero runtime JS; easy product-owned theming. | Requires finite-role validation, fallback decisions, and careful output compatibility. This is the current foundation and should remain. |

**Proposed emitted layers:** tokens/settings → layouts/compositions → recipes/blocks → minimal utilities. `Stack` and `Cluster` are compositions. Surface, Button, and Field are recipes. Utilities are demand-driven and intentionally few. Omit reset and generic element rules so host semantics and coexistence remain intact. This is a small ITCSS/CUBE hybrid, not an implementation change made by this ADR.

### Namespace proposal (pending)

| Candidate | Readability | Collision/ownership concern | Assessment |
|---|---|---|---|
| `nb-` | Very concise. | Generic enough to collide with “navbar”, “next build”, or another internal abbreviation. | Viable but weakest ownership signal. |
| `nbr-` | Concise and hints “neobrui”. | Still short; must be documented everywhere. | **Accepted**; exact selectors and migration rules are in ADR-010. |
| `neobrui-` | Maximum readability and searchability. | Verbose in markup and custom properties. | Best fallback if collision evidence outweighs ergonomics. |
| `neo-` | Familiar and short. | Extremely broad; likely collisions and poor search precision. | Not recommended. |

A selected prefix should cover classes (`.nbr-stack`), data attributes (`[data-nbr-theme]` if selected), custom properties (`--nbr-color-*`), and layers (`@layer nbr.tokens`). `_nb-spike` is disposable evidence, not an alias contract.

## Name and identity options

`neobrui` is proposed because it preserves the settled meaning and is compact without pretending to be a broad framework. Alternatives are only comparison points: `neobrutal-ui` is clearer but awkward; `brut-ui` is short but loses “neo” and is more generic; `neo-ui` is highly ambiguous; `neobrutalism-ui` is descriptive but unwieldy. Revisit only if a concrete search, trademark, package, or namespace collision appears. No name is reserved or publicly claimed by this proposal.

## Tokens, themes, and DTCG interchange

### One source, two authority models

The implementation must not maintain independently editable JS and DTCG files. Two viable models are:

- **Proposed initial model:** the existing validated JS/TS token and theme maps remain canonical authoring input; a deterministic build emits CSS and DTCG JSON. Finite-role validation, alias/type checks, round-trip checks, and CSS-equivalence tests cover the export. This retains the current zero-runtime-JS pipeline while making DTCG useful to named tooling.
- **Alternative:** DTCG JSON is canonical; JS/TS maps and CSS are generated views. This improves interoperability for DTCG-native tools but makes the build/parser and migration contract the critical dependency.

The accepted authority is generated DTCG from the already validated map for MVP, not two sources.

### Practical DTCG scope (proposed)

Pin the exact DTCG format/version supported by the implementation rather than claiming indefinite compatibility. Use `$value` for token values and `$type` for explicit or inherited types, groups for organization, and `{group.token}`-style aliases/references where the chosen format permits them. Preserve token paths deterministically (for example, `color.text.default` → `--<prefix>-color-text-default`) and define escaping/collision rules before output.

Organize themes either as validated per-theme groups or as a documented extension around a shared token group; do not imply that DTCG owns application state. A product may select `[data-theme="dark"]`, a class, or a media-query policy; the product owns that selector and toggle, while Neobrui maps configured theme values to it.

The exporter should record provenance (source file, generator version, format pin, and source revision where available), produce stable key ordering and newline/encoding, validate the DTCG schema, and test CSS equivalence for every resolved role. Import/round-trip is bounded: supported `$value`, `$type`, groups, aliases, and configured theme organization are in scope; unknown metadata/extensions are preserved only if explicitly designed, otherwise rejected with a clear diagnostic. Compatibility changes to the supported DTCG subset follow the same 0.x versioning policy as CSS output. DTCG export, validation, round-trip/alias/type tests, deterministic output, and size/maintenance accounting belong in the personal-use MVP work; no token artifact is added by this documentation task.

### Complete themes and authoring inheritance

A complete resolved theme is predictable at runtime and easy to compare, archive, and roll back. Base-plus-partial authoring is ergonomic and reduces repetition, but can hide missing roles or create order-dependent behavior. Proposed rule: resolve and validate a complete map internally before emitting CSS or DTCG. Optional inheritance is authoring syntax only; it must never leak as an unresolved runtime dependency.

Default global tokens should be opt-in, not an accidental global theme. Nested themes inherit from their nearest configured resolved parent, then the base map, with an explicit missing-role error at build time. No global selector or second theme state is created by Neobrui.

## Stack and Cluster API (proposed)

`Stack` is a vertical flow: `display: flex; flex-direction: column; gap: var(--<prefix>-stack-gap, <token>)`. It must nest safely and must not reset child margins, so content ownership remains clear. `Cluster` is a wrapping row: `display: flex; flex-wrap: wrap; gap: var(--<prefix>-cluster-gap, <token>)`, with hooks for alignment and justification.

| Hook strategy | Benefit | Cost |
|---|---|---|
| Namespaced custom-property hooks | One primitive class; local overrides; small API. | Requires docs and sensible defaults. |
| Named modifiers | Discoverable presets such as “compact”. | Selector count grows and combinations multiply. |
| Data attributes | Good for state/configuration and inspectability. | Can blur product state with layout configuration. |
| Generic gap utilities | Familiar and composable. | Broad matrix, inconsistent semantics, and more collision surface. |

Recommendation: one class per primitive plus namespaced custom-property hooks and token defaults; no broad gap/alignment utility matrix initially. Document logical properties and writing-mode behavior rather than assuming left-to-right: use `inline-size`, logical alignment, and wrapping that remains usable in RTL. QA must cover 320px, long unbroken content, nesting, local override precedence, keyboard/focus visibility in surrounding recipes, and both directions. This API is proposed, not implemented here.

## Package, source, release, and support posture

`private: true` is an npm package metadata safety control: npm refuses publication of a private package.[5] It does not make a GitHub repository private, and a private GitHub repository does not itself guarantee npm publication is blocked. Keep registry credentials and `publishConfig` out of this personal-use repository; npm publication remains blocked until separately authorized.

GitHub visibility is a separate decision: source may later be public or remain private. If source becomes public, that still does not promise compatibility, issue response, accessibility coverage, or maintenance. A supported-library gate needs its own browser/version policy, manual accessibility evidence, security path, issue policy, and capacity.

**Proposed GitHub-first contract:** create no repository as part of this task. When authorized, use Git tags and GitHub Releases with deterministic CSS archive assets and checksums.[6] Release assets should be consumable without Git dependency installs; a Git dependency is a development escape hatch, not the primary contract. Use semantic `0.x` versions: patch for corrected output/docs without intended API change, minor for additive tokens/recipes/export capabilities, and a new minor or explicitly documented breaking pre-1.0 release for contract changes. Tag the exact source, retain the previous asset, and roll back by selecting the prior release/tag rather than rewriting history. MIT is acceptable if Ryan later chooses public source and adds the license.[7]

## First-adopter path and gates

1. **Personal-use implementation gate:** Ryan approves namespace, package posture, license intent, distribution, versioning, token authority, DTCG scope, theme scoping, and Stack/Cluster details. Then add the neutral executable test site, DTCG export/validation/round-trip QA, and required size/maintenance accounting.
2. **Neutral test site:** verify plain CSS and native semantics with the full Chromium/Firefox/WebKit matrix and documented manual boundary.
3. **HTML Day Lite slice:** adopt only Surface/Button/Cluster side-by-side, with a rollback path and observed evidence. Do not migrate Ryan’s personal site simultaneously.
4. **GitHub-source gate:** before any authorized push, check namespace, MIT file, README, CI, secrets/history, provenance, deterministic release assets, and issue/support wording.
5. **Supported-library gate:** require manual accessibility runs, browser/version policy, maintenance capacity, and security/support process. Current automation is not this evidence.
6. **Competitive-framework gate:** require multiple real adopters, evidence-backed expansion, docs/examples, user evidence, and sustained release/support capacity. No present readiness is implied.

## Ryan decisions still needed

| Decision | Proposed default | Ryan’s choice still needed |
|---|---|---|
| Stable namespace | `nbr-` family | Choose `nb-`, `nbr-`, `neobrui-`, or another justified prefix. |
| Canonical token authority | Validated JS/TS maps; deterministic DTCG export | Confirm this or choose DTCG-canonical generation. |
| DTCG format/version and theme organization | Pin current supported format; resolved per-theme groups | Confirm exact pin and extension/organization policy. |
| Package name/private posture | Private/unpublished; no registry credentials | Confirm package name and whether npm remains out of scope. |
| GitHub visibility | Decide later, separately from support | Public or private when source gate is reached. |
| License | MIT acceptable | Add/approve MIT only at source gate. |
| Version/release cadence | Git tags/releases; semantic `0.x` | Confirm patch/minor/breaking interpretation and cadence. |
| Theme selector/state | Product-owned selector and toggle | Choose preferred product convention and nested fallback rule. |
| Stack/Cluster API | One class + namespaced hooks | Approve hooks, defaults, and alignment/justification surface. |
| Adopter and support threshold | Neutral site, then bounded HTML Day Lite | Set evidence threshold before broader migration/support. |

## Sources

[1] ITCSS, https://itcss.io/
[2] CUBE CSS, https://cube.fyi/
[3] BEM, https://getbem.com/
[4] SUIT CSS, https://suitcss.github.io/
[5] npm package.json `private`, https://docs.npmjs.com/cli/v11/configuring-npm/package-json
[6] GitHub Releases, https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
[7] MIT License, https://opensource.org/license/mit/
[8] Semantic Versioning, https://semver.org/
[9] Every Layout, https://every-layout.dev/

Every Layout is included as a relevant composition/layout reference; the proposed Stack/Cluster behavior is deliberately limited and is not a claim of compatibility with that project.[9]
