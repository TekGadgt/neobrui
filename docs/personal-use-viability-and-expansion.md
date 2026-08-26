# Neobrui personal-use viability and expansion

Assessment date: 2026-08-26

## Executive recommendation

**Recommendation: keep Neobrui as a private, CSS-only personal-project kit, not as a public framework.** Phase 1 has implemented the stable `nbr` namespace, `src/blocks` Surface/Button/Field Blocks, ordered five-layer contract, and product-owned `data-theme` boundary. The repository still lacks adoption authorization, release policy, license decision, manual assistive-technology coverage, and user evidence; those gaps prevent a public-readiness claim.

The smallest viable formalization is not eight components. It is:

1. decide a stable CSS namespace and package/repository/license posture;
2. preserve one foundations entry plus standalone and aggregate `Surface`, `Button`, and `Field` CSS entries;
3. add only two low-risk layout primitives, `Stack` and `Cluster`, because both representative projects repeatedly implement vertical rhythm and wrapping action/tag rows;
4. document token authoring, native markup contracts, cascade-layer ownership, support limits, and local consumption;
5. prove the stable surface in a neutral example, then adopt a bounded slice in one project only after Ryan chooses the first adopter;
6. keep automated Chromium/Firefox/WebKit verification and zero runtime JavaScript, while recording all unavailable manual checks as unavailable.

`Field` can remain in the package because it is already built and tested, but neither representative project's current public UI justifies expanding it into a broad form system now. `textarea` and `select` selectors exist in the Block source, yet the validated fixture is an email `input`; checkbox/radio styling and native-control matrices are absent. Expand forms only when a real product flow needs them.

## Position and claim boundary

This assessment treats the current repository as a **private Phase 1 three-Block pilot**. It does not claim:

- a public package or stable API;
- competitive framework completeness;
- Windows High Contrast, NVDA, VoiceOver, physical-device, physical-keyboard, or true browser-UI zoom support;
- executed manual accessibility coverage;
- sustainable public maintenance or support capacity.

Historical pre-migration evidence explicitly labels the former `_nb-spike` namespace disposable. The current source uses stable `nbr` names and remains unpublishable (`README.md`; `decisions/ADR-010-cube-migration-contract.md`).

## Validated current inventory

| Surface | Verified repository evidence | Current boundary |
|---|---|---|
| Semantic token schema | `src/tokens/schema.mjs` requires finite color, border, radius, shadow-axis, spacing, control, region, font, text, motion, focus, surface, button, and field roles. `src/tokens/tokens.mjs` validates fixture-owned maps and emits deterministic custom properties under a temporary prefix. `fixtures/inputs.mjs` supplies five independent fixture mappings. | Names are internal and temporary. Theme values, palette aliases, fonts, content, and motifs remain product-owned. No DTCG interchange contract exists (`decisions/ADR-005-dtcg.md`). |
| Theme mapping and identity removal | `evidence/mappings.md` records light, dark, workshop, nested, and neutralized relationships. `evidence/identity-removal.md` records preserved hierarchy/state after identity-bearing values are neutralized. | This proves separability, not that the fixture palettes should ship. The five themes are explicitly excluded from the private archive (`size-report.json`). |
| Surface Block | `src/blocks/surface.css` implements opt-in quiet, outlined, and raised levels with borders, semantic colors, hard shadow, and forced-colors fallback. Historical acceptance evidence is in `evidence/spike-2-recipes.md`. | One global class and product-owned theme state; no component wrapper or layout behavior. |
| Button Block | `src/blocks/button.css` styles native buttons and links, including hover, active, focus-visible, disabled/`aria-disabled`, busy, reduced motion, forced colors, logical shadow direction, and fixed direction. Native elements retain behavior (historical `decisions/ADR-003-spike-2-recipes.md`). | CSS does not create button/link semantics, state logic, announcements, routing, or application actions. `aria-disabled` alone does not disable a link; the application remains responsible. |
| Field Block | `src/blocks/field.css` supplies a wrapper, label/description styling, text-like `input`/`textarea`/`select` geometry, focus, disabled state, invalid border, adjacent error text, and forced-colors rules. Browser evidence covers the native email-field proof (`evidence/spike-2-recipes.md`). | The proven semantic contract is label + description/error + email input. Textarea/select are styled but not equivalently evidenced. Checkbox/radio are absent. Error visibility depends on adjacency and attributes supplied by the product. |
| RTL, fixed, and no-shadow policy | `decisions/ADR-004-rtl-shadow.md` defines a diagonal zero-blur shadow that mirrors inline offset under nearest computed RTL, supports nested direction, and exposes a fixed down-right art-direction escape hatch. Borders/focus/invalid/disabled cues survive shadow removal. `tests/shadows.spec.js` and `evidence/spike-3-shadows.md` cover the automated matrix. | Shadow is decorative, never the only state/accessibility cue. True zoom, hardware input, screen readers, and physical forced colors remain manual gaps. |
| Cascade layers | Tokens emit `@layer nbr.tokens`; aggregate Blocks predeclare `nbr.tokens, nbr.compositions, nbr.utilities, nbr.blocks, nbr.exceptions`. Consumer unlayered CSS or a later consumer layer wins. The library avoids resets, IDs, broad `!important`, and hostile specificity (`decisions/ADR-010-cube-migration-contract.md`). | Compositions and Utilities are reserved and empty in Phase 1; future layer content requires a new decision. Hostile consumer CSS is consumer-owned failure. |
| Plain CSS / CSS Modules / Astro / Tailwind coexistence | `fixtures/coexistence/`, `fixtures/css-modules/`, `fixtures/astro/`, and `fixtures/tailwind/` exercise source order, modules plus global Blocks, one Astro global import plus scoped styles, and a pinned Tailwind fixture. `evidence/spike-4-coexistence.md` records the cross-engine results. | These are fixture-specific integration proofs, not adapters/plugins or blanket support for every configuration. Tailwind preflight and Astro import placement remain consumer-owned. |
| Private CSS-only archive and budgets | `decisions/ADR-006-size-package.md`, `scripts/size-spike.mjs`, and `size-report.json` define explicit CSS subpath exports, no dependencies, and zero runtime JS/assets. Measured gzip: foundations 515 B, Surface 285 B, Button 703 B, Field 521 B, aggregate Blocks 1,091 B, combined consumer 1,459 B. Archive size is 2,042 B. | Overall verdict is `warning/narrow` because standalone Button exceeds its provisional minified budget (2,413 B vs 1,800 B), though it remains below the gzip budget. The archive is `private: true`, local-only, and must not be published. |
| QA and seeded harness | `scripts/qa-rehearsal.mjs`, `qa/qa-rehearsal.spec.js`, and `decisions/ADR-007-qa-rehearsal.md` define baseline and deterministic missing-label, 320px-clipping, and shadow-only-focus seeds across Chromium, Firefox, and WebKit. `evidence/spike-6-qa-rehearsal.md` records 12/12 seeded detections and clean retest. `pnpm verify:clean` is the canonical clean-tree path (`package.json`). | axe, screenshots, DOM semantics, geometry, and computed styles are complementary automation. They do not establish real assistive-technology, OS High Contrast, touch, hardware keyboard, or browser UI zoom behavior. Human time targets remain unvalidated. |
| Support boundary | `evidence/qa-checklists.md` uses `passed`, `failed`, `manual-unavailable`, `not-triggered`, and `not-run`; `evidence/spike-6-qa-rehearsal.md` keeps the result at a private pilot. | Public integration/support claims require real manual coverage, capacity evidence, user evidence, and a release/support policy. |

## Representative project fit

The comparison repositories were inspected read-only. Paths below are project-relative and prefixed with the repository label for clarity.

### `personal_site`

| Existing need/evidence | Neobrui now | Project glue | Missing/shared need vs product-owned concern |
|---|---|---|---|
| Light/dark semantic values, hard shadows, border widths, radius, type, link, chip, and row tokens (`personal_site: src/styles/theme.css`) | The semantic color/surface/focus/shadow roles map well; nested theme scoping is already proven. | Author a product theme map from existing values; retain current `[data-theme]` toggle behavior or bridge it to the chosen Neobrui scope; import global CSS once in Astro. | **Shared:** stable namespace and ergonomic theme authoring. **Product-owned:** exact palette, Google font loading, retro/display type, link palette, chip variants, dark-mode persistence. |
| Cards, prose blockquote/image frames, 404 card, headers, and project/community surfaces (`personal_site: src/styles/prose.css`; `src/pages/404.astro`; `src/components/work/ProjectCard.astro`; `src/components/work/CommunityCard.astro`) | Surface quiet/outlined/raised can replace some repeated border/background/shadow mechanics. | Preserve component-specific padding, page composition, responsive grids, imagery, and asymmetric prose accents as local CSS. | **Shared:** Surface adoption examples; perhaps Rule/Callout later. **Product-owned:** card composition, prose treatment, imagery, content hierarchy. |
| Repeated vertical stacks and wrapping rows: timeline, button wall, tags, nav, card lists (`personal_site: src/components/work/ExperienceSection.astro`; `src/components/shared/ButtonWall.astro`; `src/components/blog/PostHeader.astro`; `src/components/layout/Header.astro`) | No layout primitive exists. | Current Astro scoped CSS can coexist while selected wrappers gain opt-in layout classes. | **Shared missing:** Stack and Cluster. Breakpoint-specific navigation, sticky header, and grid composition remain product glue. |
| Button-like links and actual icon/navigation buttons (`personal_site: src/components/layout/Header.astro`; `src/components/layout/ThemeToggle.astro`; `src/pages/404.astro`) | Button covers native `<button>` and styled `<a>` with focus/press/forced-color behavior. | Preserve semantic distinction and local variants/sizes; the hamburger and theme toggle still require product JS and icon treatment. | **Shared:** documented button-vs-link markup and icon-button examples. **Product-owned:** theme/nav behavior and active-route styling. |
| Chips/tags (`personal_site: src/components/shared/Chip.astro`) | No Badge Block. | Keep current Astro component and local token variants. | **Useful-next shared candidate:** neutral Badge/Tag presentation only after a second consumer or clear duplication; current semantic variants are product-owned. |
| Rich prose links, rules, blockquotes, tables (`personal_site: src/styles/prose.css`) | Surface can help blockquotes; no Link or Rule Block. | Retain prose stylesheet; global typography and content styling are intentionally outside core. | **Useful-next:** bounded Link focus/underline and Rule primitives if adopted in both projects. **Product-owned:** prose rhythm, heading/type scale, editorial content. |
| Public forms | No current public native form flow found. Keystatic/editor dependencies are an authoring system, not evidence that the site needs framework form Blocks (`personal_site: package.json`; `keystatic.config.ts`). | None now. | Textarea/select/checkbox/radio expansion is not personal-MVP evidence. |

**Fit judgment:** viable for selective foundations/Surface/Button/layout adoption, but not a drop-in rewrite. Astro scoped styles and product identity should remain. The site is the broader integration test, not the easiest first migration.

### `htmlday-lite`

| Existing need/evidence | Neobrui now | Project glue | Missing/shared need vs product-owned concern |
|---|---|---|---|
| One global CSS file with paper/ink palette, hard borders/shadows, panels, buttons, focus, reduced layouts, and 320px minimum (`htmlday-lite: src/styles.css`) | Surface and Button closely match existing panel/button mechanics. Zero runtime JS fits the stylesheet architecture. | Map `--ink`, `--paper`, colors, borders, and shadow offsets to a product theme; keep global reset/base and application selectors local. | **Shared:** namespace/theme map/docs. **Product-owned:** grid-paper motif, exact colors, editor/preview/takeaway/creator composition. |
| Multiple panel-like regions: editor, preview, creator, takeaway, receiver (`htmlday-lite: index.html`; `take/index.html`; `src/styles.css`) | Raised/outlined Surface can remove repeated border/background/shadow declarations from selected regions. | Different panel headers, overflow, grid areas, and QR sizing remain local. | Surface is immediately consumable; no new component Block is needed. |
| Primary, default, and quiet buttons; disabled and dynamic states (`htmlday-lite: index.html`; `take/index.html`; `src/styles.css`; `src/editor-app.js`; `src/receiver-app.js`) | Button covers the common visual/interaction cues. | Preserve product JS, `hidden`/`disabled`, copy/download/share safety, and primary/quiet variants as product hooks until variants are deliberately standardized. | **Shared:** markup/state handbook. **Product-owned:** action logic, status announcements, QR budget gating, safe interaction enablement. |
| Wrapping action rows and spaced groups (`htmlday-lite: index.html`; `take/index.html`; `.actions` in `src/styles.css`) | No layout primitive exists. | Cluster can replace the repeated flex-wrap/gap mechanism; Stack can cover vertical groups without owning page grid. | **Shared missing:** Stack and Cluster. |
| Live badge, status/error text, safety note (`htmlday-lite: index.html`; `take/index.html`; `src/styles.css`) | No Badge or Callout Block. Surface can frame the safety note but does not encode status semantics. | Keep `role=status`, `aria-live`, `role=alert`, copy, and state changes in the application. | **Useful-next:** visual Badge/Callout only if personal_site provides a second use. **Product-owned:** announcements, severity, copy, security policy. |
| CodeMirror editor, iframe preview, QR canvas/progress (`htmlday-lite: src/code-editor.js`; `index.html`; `src/styles.css`) | Intentionally outside current Blocks. | Keep CodeMirror theme, focus forwarding, iframe sandbox, progress, QR, and responsive workspace local. | Reject framework ownership of editor/preview/QR/security/hosting concerns. |
| Native form controls beyond buttons | No `input`, `textarea`, `select`, checkbox, or radio exists in current app markup; CodeMirror is not a native textarea (`htmlday-lite: index.html`; `src/code-editor.js`). | None now. | No evidence for form expansion in this project. |
| Browser/device matrix | Project declares Chromium, Firefox, WebKit, Pixel 7, and iPhone 15 emulation (`htmlday-lite: playwright.config.js`; `README.md`). | Adoption must preserve this matrix and add targeted Neobrui integration assertions rather than weakening coverage. | Shared QA gains integration evidence; physical event/device checks remain product-specific and manual. |

**Fit judgment:** the closest first real adopter because Surface/Button and Cluster map directly to existing CSS. It is also a live, interaction-heavy product, so a neutral example first is lower risk. Ryan must choose between those two adoption starts.

## Decision-relevant comparison with maintained alternatives

This is not a new market survey. Only three observations change the expansion decision:

1. **Token ergonomics and package shape are product features.** Open Props publishes a large custom-property system with many explicit package subpath exports, CSS artifacts, JSON/token exports, and a maintained manifest. That demonstrates the usability value—and compatibility burden—of a deliberate import surface.[1] Neobrui should copy the principle of explicit, documented entries, not Open Props' broad palette or API size.
2. **Broad semantic styling creates a broad support matrix.** Pico describes itself as class-light semantic CSS, documents inputs, textarea, select, checkbox, radio, switch, range, layout, content, and components, and tests current stable Chrome, Firefox, Edge, and Safari.[2] That breadth is exactly what Neobrui should avoid until real personal-project demand and manual capacity exist.
3. **Package exports should be an explicit compatibility boundary.** Node's package documentation states that `exports` can define multiple entry points while preventing undeclared entry points, thereby defining the public interface.[3] Keep explicit aggregate and subpath CSS entries, but do not freeze them until the namespace/distribution decision is made.

Conclusion: do not replace product identity with Pico/Open Props, and do not pursue feature parity. Formalize the narrow semantics already proven, add only evidence-backed layout primitives, and require demand before each new Block.

## Prioritized expansion matrix

Complexity and QA are relative to this repository: **L** low, **M** medium, **H** high. Dependency/API risk includes consumer lock-in and integration coupling, not only third-party packages.

| Expansion | Tier | Evidence/source | Complexity | Maintenance / QA increase | Dependency / API risk | Prerequisite decisions |
|---|---|---|---|---|---|---|
| Stable CSS namespace for classes, data attributes, custom properties, and layers | **personal-use MVP** | Disposable `_nb-spike` markers in `README.md`, Blocks, token generator, and ADRs | M | M: rename fixtures/tests/docs and freeze conventions | **H**: every consumer bakes selectors/variables into markup/CSS | Choose namespace; decide whether layer names are versioned and whether private data attributes are part of the supported API |
| Private package shape: foundations, aggregate Blocks, standalone Surface/Button/Field; zero JS | **personal-use MVP** | Working private archive and consumer in `size-report.json`; explicit entry-point principle.[3] | M | M: archive and consumer tests remain release gates | M: import paths become sticky; local archive/workspace method can leak into lockfiles | Choose package name, distribution method, version policy, and whether foundations are required or optional |
| Token authoring/theme ergonomics | **personal-use MVP** | Current fixture map is JS-only and complete-role validation is strict (`src/tokens/schema.mjs`; `fixtures/inputs.mjs`); comparison shows mature token systems expose deliberate import/token surfaces.[1] | M | M: schema diagnostics, generated snapshot, and migration checks | H if names/required roles freeze too early | Choose authored format (JS module vs CSS template; DTCG remains deferred), defaults policy, theme selector, and whether partial themes inherit |
| Onboarding and support-boundary documentation | **personal-use MVP** | Current evidence is split among ADRs/fixtures; `README.md` says no public API | M | L/M: examples must track API | L | Stable namespace/package/theme decisions; define supported engines and “manual-unavailable” language |
| Neutral example/handbook for native markup, theming, layers, RTL/fixed shadows, no-shadow, Astro and plain CSS | **personal-use MVP** | Existing fixtures prove behavior but are spike evidence, not onboarding (`fixtures/`; `evidence/spike-4-coexistence.md`) | M | M: example becomes executable documentation | L/M: avoid making fixture markup a component API | Decide neutral-first vs immediate adopter; choose which examples are normative |
| `Stack` layout primitive | **personal-use MVP** | Repeated vertical flex/grid groups in both projects; current core lacks layout | L | L/M: LTR/RTL, nested spacing, 320px, override tests | M: class/hook naming becomes shared | Choose whether it controls direct-child block margins or uses flex/grid gap; choose exception/nesting behavior |
| `Cluster` layout primitive | **personal-use MVP** | Wrapping `.actions`, tags, button wall, nav/timeline metadata in both projects | L | L/M: wrapping, alignment, 320px, RTL, overflow tests | M | Choose default gap/alignment and whether justification is hook-only |
| One-project private-alpha migration | **personal-use MVP** | Both fit tables; `htmlday-lite` is closest while neutral example is safest | M/H depending slice | M: project build/browser matrix plus rollback | M: consumer markup becomes API evidence | Ryan chooses first adopter or neutral-only start; define bounded slice and rollback/duplication strategy |
| Rule Block | **useful-next** | `personal_site: src/styles/prose.css` and border dividers; htmlday panel separators | L | L: forced colors, writing modes, spacing | L | Confirm at least two migrated uses and whether spacing belongs to Rule or Stack |
| Link Block | **useful-next** | Both projects have global and contextual links; current Button covers only button-like links | M | M: visited/hover/focus/forced-colors/underline and dark themes | M/H: global link styles can collide with product identity | Decide opt-in class vs element styling; product palettes remain outside core |
| Badge/Tag Block | **useful-next** | `personal_site` Chip and `htmlday-lite` live badge | M | M: text reflow, forced colors, status semantics documentation | M: variant taxonomy can absorb product semantics | Keep visual Block neutral; do not own live/status semantics; require shared variant vocabulary before adding variants |
| Callout Block | **useful-next** | Prose blockquotes, draft banner, HTML Day safety note | M | M/H: severity cues, headings, links, reflow, forced colors | H if visual severity becomes semantic API | Decide whether this is only a Surface composition; application must own `role`, urgency, and copy |
| Textarea/select validation coverage under Field | **useful-next, demand-gated** | Selectors exist in `src/blocks/field.css`, but actual proof is input and neither representative public UI needs these controls | M | M/H across engines, states, long text, native appearance, mobile | M: selector/markup contract | Require an actual form flow; decide native appearance policy and error/description markup |
| Checkbox/radio Blocks | **useful-next, demand-gated** | Absent from core and representative markup; Pico's breadth illustrates added form surface.[2] | H | H: native appearance, groups, checked/indeterminate/disabled/focus, forced colors, touch, AT/manual matrices | H | Require actual product need, appearance policy, grouping/error semantics, and manual capacity |
| CI on every change, versioning, changelog, release archive verification | **useful-next** for private cross-repo use; **public prerequisite** | Canonical `pnpm verify:clean` and deterministic package tests already exist | M | M: CI minutes, browser provisioning, release discipline | M | Choose host, supported Node/pnpm, semver posture, artifact retention; no CI claim until configured and observed |
| License, CONTRIBUTING, security/support policy, issue templates, public README | **public-framework-only** | Repository currently has no license/public posture. GitHub notes an open-source license enables others to use, change, and distribute the project.[4] | M | M/H: governance and response expectations | H: legal/public commitment | Ryan chooses whether source is public, license, contribution posture, security contact, and support boundaries |
| Registry publication and automated release | **public-framework-only** | Current manifest and archive are private/local (`package.json`; `size-report.json`) | H | H: provenance, credentials, tags, rollback, deprecation | H | Public-source decision, name availability, license, CI, semver, release owner, provenance policy |
| Public accessibility/browser support statement | **public-framework-only** | `evidence/spike-6-qa-rehearsal.md` lists manual gaps and unvalidated human capacity | H | **H ongoing**: real OS/AT/device matrix and issue response | H: creates support expectations | Execute and record manual procedures; sustainable cadence; user evidence; browser/version policy |
| User-evidence program / external feedback loop | **public-framework-only** until authorized | No user evidence or outreach authorized; QA checklist marks it unavailable | H | H and recurring | H: privacy, support, scope growth | Explicit authorization, research plan, privacy/consent, triage capacity |
| DTCG export/import | **reject/defer** | `decisions/ADR-005-dtcg.md` finds no named consumer or round-trip workflow | M/H | M/H: conversion and compatibility tests | H: second contract | A concrete consumer and round-trip acceptance test |
| Framework adapters/plugins or runtime component JS | **reject/defer** | Current coexistence succeeds without adapters; zero-runtime-JS is settled (`decisions/ADR-005-layer-contract.md`; `size-report.json`) | H | H across framework versions | **H** dependencies and behavior ownership | Only reconsider after a named consumer cannot use CSS entries; runtime JS would require a new product decision |
| Broad reset, global element takeover, hostile specificity, or bundled identity | **reject** | Reset-free opt-in contract and identity-removal evidence (`decisions/ADR-003-spike-2-recipes.md`; `evidence/identity-removal.md`) | — | Would expand regression surface substantially | **H** collision/identity risk | None; conflicts with settled product-owned identity and coexistence model |
| “Eight Block” completeness target | **reject** | Actual needs support three Blocks plus two layout primitives; current projects do not evidence eight shared Blocks | — | Arbitrary surface multiplies QA | H | Replace count targets with consumer evidence gates |

## Smallest viable personal-use formalization

### Proposed supported surface

- **Runtime:** CSS only; exactly zero package runtime JavaScript and no runtime dependencies/assets.
- **Entries:** foundations; aggregate Blocks; standalone Surface, Button, Field; one layout entry containing Stack and Cluster (or two explicit subpaths if size/ownership tests favor that).
- **Semantics:** native HTML owns roles, names, keyboard behavior, link navigation, form validation, disabled behavior, and state. Product JavaScript may drive product behavior but is not supplied by Neobrui.
- **Identity:** each product owns palette, type, fonts/loading, content, motifs, page composition, editor/preview/QR behavior, hosting, and analytics/privacy/security choices.
- **Integration:** opt-in global classes/data attributes/custom properties; named cascade layers; plain CSS and one-import Astro path documented. CSS Modules and Tailwind evidence remains available but need not become first-class onboarding unless a personal consumer uses them.
- **Verification:** retain all configured Chromium, Firefox, and WebKit projects. Add stable-namespace and Stack/Cluster tests, package consumer tests, size checks, clean-tree verification, and affected integration tests in the adopter. Do not remove engines to simplify adoption.
- **Support language:** “used in Ryan's private projects under the recorded automated matrix”; never “supports NVDA/VoiceOver/Windows High Contrast/devices/200% UI zoom” until real dated runs pass.

### Adoption sequence

1. **Decision commit:** record namespace, package name, authoring format, distribution, license/repository posture, and first-adoption target in ADRs.
2. **Contract rename:** replace temporary selectors/variables/data attributes/layer names atomically; add a migration map only for internal review, not indefinite aliases.
3. **Docs and neutral fixture:** write copy/paste theme + native markup + layers + RTL/no-shadow examples and test them.
4. **Layout proof:** implement Stack and Cluster via tests first; run the full existing browser matrix and size checks.
5. **Local package proof:** build a private archive and install it in a fresh consumer; verify explicit aggregate/subpath imports and zero JS.
6. **Bounded adoption:** migrate either (a) a neutral example only, or (b) one small `htmlday-lite` Surface/Button/actions slice if Ryan authorizes it. Keep product CSS beside the migration so rollback is a single commit.
7. **Observe before expanding:** record duplication removed, glue required, defects, manual time, and whether a second project wants the same primitive. Promote Rule/Link/Badge/Callout only from that evidence.

Do not simultaneously rewrite both projects. A one-consumer alpha reveals namespace/theme/import mistakes without turning a private contract change into a coordinated migration.

## Rejected and deferred work

- No runtime component layer or JavaScript behavior package.
- No global reset or unscoped element takeover.
- No raw palette props, bundled brand palette, bundled font, product copy, motifs, editor/preview/QR abstractions, hosting integration, or content/editor schema.
- No Tailwind/Astro/React adapters while CSS import/coexistence works.
- No arbitrary Block-count target.
- No checkbox/radio or comprehensive form styling without a real consumer flow.
- No DTCG artifact without a named importer and round-trip test.
- No registry publication, public support statement, or public contribution process during the personal-use gate.
- No indefinite compatibility aliases for the disposable `_nb-spike` namespace; formalization is the point to make one deliberate break.

## GitHub-readiness checklist

This is a future gate, not current status.

### Must be complete before public source

- [ ] Stable project/package/CSS namespace selected; trademark/name collision reviewed.
- [ ] Repository purpose and non-goals documented without “framework complete” language.
- [ ] License selected by Ryan and included as a detectable `LICENSE`/`LICENSE.md`; a public repository without this decision does not grant the intended reuse terms.[4]
- [ ] `package.json` name, version, `private` posture, files, side-effects/CSS behavior, and explicit exports reviewed.
- [ ] Security, support, contribution, code-of-conduct, and issue-triage posture chosen.
- [ ] Generated files, evidence, fixtures, and release artifacts have a documented source/provenance policy.
- [ ] No secrets, private links, personal data, or host/container-only paths in history or artifacts.
- [ ] Automated CI actually passes clean install, token build, archive/consumer, sizes, seeded QA, and Chromium/Firefox/WebKit matrix.
- [ ] Release/version/deprecation policy documented; first public tag created only after artifact reproduction.
- [ ] Direct onboarding examples are tested against the shipped archive, not repository-relative internals.

### Must be complete before public support claims

- [ ] Windows High Contrast / forced colors tested on real Windows in agreed browsers.
- [ ] NVDA tested with Firefox and Chrome on Windows.
- [ ] VoiceOver tested with Safari on macOS.
- [ ] Physical keyboard and representative physical touch/device tests run.
- [ ] True browser UI zoom at 200% run in the agreed desktop browsers.
- [ ] Manual runs record OS/browser/AT versions, expected/actual result, evidence, failures, and retests.
- [ ] User evidence collected under an authorized privacy-respecting plan.
- [ ] Sustainable owner capacity measured for issue response, manual release checks, browser upgrades, and documentation.
- [ ] Browser/AT/device support wording matches only the matrix actually run; automation is described as complementary, not substitutive.

## Ryan decision gate

Implementation should not start until Ryan decides all items below.

| Decision | Options / recommendation | Why it gates work |
|---|---|---|
| Stable CSS namespace | Choose a short project-owned prefix for classes, data attributes, custom properties, and layers. **Recommendation:** one consistent `nb-`-style family, after name-collision review; do not preserve `_nb-spike`. | Renaming after adoption is the highest API/migration cost. |
| Repository posture | Keep private personal repo now; optionally make source public later; or design a public framework. **Recommendation:** private personal repo for this phase. | Determines governance, documentation, issue/security posture, and whether compatibility is promised. |
| Package name and `private` posture | Internal scoped name vs unscoped local name; keep `private: true` until publication is explicitly authorized. | Name appears in lockfiles/imports and can imply availability. |
| License | All-rights-reserved/private use vs a chosen open-source license if/when public. **Recommendation:** make an explicit legal choice before any public source; do not infer a license. | Public visibility and permission to use/change/distribute are different decisions.[4] |
| Distribution method | Workspace dependency, local `.tgz`, Git dependency, vendored CSS, or registry. **Recommendation:** reproducible local `.tgz` for private alpha; consider workspace linkage only during development. No registry now. | Controls reproducibility, lockfiles, update flow, and release burden. |
| Versioning | Internal `0.x` semver-like releases vs commit pinning. **Recommendation:** `0.x` private versions once a second repository consumes archives. | Consumers need a traceable contract and rollback point. |
| Token authoring format | Validated JS map, authored CSS template, or future DTCG. **Recommendation:** keep validated JS-to-CSS for MVP, add a documented copyable theme template, and defer DTCG. | Changes build tooling, diagnostics, and consumer workflow. |
| Theme scoping | Adopt Neobrui data theme, bridge existing product theme attribute, or allow selector configuration. **Recommendation:** preserve product-owned theme state and generate mappings for documented selectors rather than duplicating theme state. | Both products already have identity/state assumptions; duplicate selectors cause drift. |
| First alpha | Neutral example only, `htmlday-lite` bounded slice, or `personal_site` bounded slice. **Recommendation:** neutral example first, then `htmlday-lite` Surface/Button/Cluster slice because it is the closest fit. | Determines whether the first namespace/import mistakes affect a live product. |
| Layout API | Stack child-margin model vs flex/grid gap; Cluster hooks and defaults. **Recommendation:** test the simplest gap-based opt-in classes against both projects before freezing. | Layout behavior affects nested content, wrapping, writing modes, and overrides. |
| Public threshold | Define evidence that changes “personal kit” to “public source” and separately to “supported framework.” **Recommendation:** public source may follow stable alpha/docs/license/CI; support claims require manual and capacity gates. | Prevents source availability from being mistaken for support readiness. |

**Go decision:** approve personal-use formalization only after the namespace, package/repository/license posture, distribution method, token authoring format, and first-alpha target are recorded. If any remain undecided, continue using the current repository only as disposable evidence and do not expose its selectors to another project.

## Uncertainty and limitations

- This was a static source assessment. Neither comparison project was edited, built, or manually exercised for this report.
- Current repository automation is strong evidence for the tested fixtures, not for untested real-project markup or CSS interactions.
- Browser automation versions and current fixture results do not establish future browser support.
- Manual accessibility/device items remain unexecuted. The follow-on manual-testing documentation may define procedures, but procedures are not results.
- Human QA and maintenance estimates remain low confidence because the repository has automated timings but no real recurring public-support history.
- External comparison was deliberately narrow. It supports package/token and scope decisions, not a claim that Neobrui is equivalent to or better than the cited projects.

## Sources inspected

### Neobrui repository

`README.md`; `package.json`; `playwright.config.js`; `src/tokens/schema.mjs`; `src/tokens/tokens.mjs`; `src/recipes/surface.css`; `src/recipes/button.css`; `src/recipes/field.css`; `src/recipes/index.css`; `fixtures/inputs.mjs`; integration fixtures under `fixtures/`; `decisions/ADR-002-token-schema.md`; `decisions/ADR-003-spike-2-recipes.md`; `decisions/ADR-004-rtl-shadow.md`; `decisions/ADR-005-dtcg.md`; `decisions/ADR-005-layer-contract.md`; `decisions/ADR-006-size-package.md`; `decisions/ADR-007-qa-rehearsal.md`; `evidence/application-owned.md`; `evidence/identity-removal.md`; `evidence/mappings.md`; `evidence/qa-checklists.md`; `evidence/spike-2-recipes.md`; `evidence/spike-3-shadows.md`; `evidence/spike-4-coexistence.md`; `evidence/spike-5-size-package.md`; `evidence/spike-6-qa-rehearsal.md`; `size-report.json`; relevant scripts and tests referenced above.

### Read-only comparison repositories

- `personal_site`: `package.json`; `keystatic.config.ts`; `src/styles/theme.css`; `src/styles/global.css`; `src/styles/prose.css`; relevant Astro pages/components under `src/pages/` and `src/components/`, especially Header, ThemeToggle, Chip, ButtonWall, PostHeader/PostCard, ExperienceSection, ProjectCard, and CommunityCard.
- `htmlday-lite`: `README.md`; `package.json`; `playwright.config.js`; `index.html`; `take/index.html`; `src/styles.css`; `src/code-editor.js`; `src/editor-app.js`; `src/receiver-app.js`; relevant browser/unit/integration/e2e tests.

External primary sources were retrieved on 2026-08-26. Browser automation was unavailable in the research environment, so the cited current source files were retrieved directly from their official GitHub repositories; the GitHub license page was also checked against its official documentation source.

## Sources

[1] [Open Props package manifest](https://github.com/argyleink/open-props/blob/main/package.json)
[2] [Pico CSS README](https://github.com/picocss/pico/blob/main/README.md)
[3] [Node.js packages documentation source](https://github.com/nodejs/node/blob/main/doc/api/packages.md)
[4] [GitHub Docs: Adding a license to a repository](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)
