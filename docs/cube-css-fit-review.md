# CUBE CSS fit review

Status: research recommendation; architecture acceptance remains pending

Accessed: 2026-08-26

## Decision in one page

**Recommendation: adopt CUBE-primary, with ITCSS-style cascade ordering only as an implementation detail.** CUBE should name Neobrui's public mental model: CSS and tokens, Composition, Utility, Block, and Exception. It should not be reduced to four directories. The existing token/recipe work remains useful, but the proposed hybrid's emitted order should change from `tokens → compositions → blocks → utilities` to `tokens → compositions → utilities → blocks → exceptions`. That order reflects CUBE's high-to-contextual progression: global/high-level CSS does most work, compositions and utilities support it, blocks add a small contextual namespace/specificity boost, and exceptions are concise block deviations.[2][6][7]

Utilities are a first-class CUBE principle, not optional terminology. For Neobrui that means a deliberately governed utility API, not a utility-first framework and not a late layer intended to defeat blocks. The official guidance defines a utility as one job done well, commonly one property or a concise related group; it also warns against `!important` specificity hacks.[5] Therefore normal Neobrui utilities should precede blocks and should **not** override block-owned accessible states by default. An application can still override the kit through a declared later product layer or normal unlayered CSS.

CUBE-primary is a qualified adoption. CUBE assumes useful high-level/global CSS can make a page look good before blocks load, whereas Neobrui has an established reset-free, opt-in coexistence contract. Neobrui should preserve that contract: no reset, element takeover, global theme selector, or identity layer. Its “CSS/global” foundation is limited to opt-in generated token scopes and inherited values. This is an explicit package-boundary adaptation, not evidence that CUBE itself prescribes opt-in-only globals.[3]

No selector, CSS artifact, token artifact, package contract, test, namespace, release setting, or ADR status is changed by this review.

## Method and complete first-party source inventory

The authoritative source was `cube.fyi`. Discovery began at the rendered site navigation, followed every same-origin documentation link, and checked conventional `robots.txt`, `sitemap.xml`, `sitemap_index.xml`, `feed.xml`, and `rss.xml` endpoints. Every documentation page links the same ten-page navigation set; recursive same-origin traversal reached no eleventh documentation page. All ten returned HTTP 200 and were reviewed in full. The conventional discovery endpoints returned the site's branded 404 document, so they added no pages. There were no inaccessible documentation pages and no duplicate canonical documentation URLs; fragment links on the home page were treated as sections of `/`, not separate pages.

| # | First-party page | URL | Access date | Review status |
|---:|---|---|---|---|
| 1 | CUBE CSS | `https://cube.fyi/` | 2026-08-26 | Complete; definition, comparison, scale claim, overview link.[1] |
| 2 | Principles | `https://cube.fyi/principles` | 2026-08-26 | Complete; simplicity, progressive enhancement, reduced abstraction, tool agnosticism.[2] |
| 3 | CSS | `https://cube.fyi/css` | 2026-08-26 | Complete; cascade, inheritance, global CSS, progressive-first posture.[3] |
| 4 | Composition | `https://cube.fyi/composition` | 2026-08-26 | Complete; flexible layouts, flow/rhythm, contextual custom properties.[4] |
| 5 | Utility | `https://cube.fyi/utility` | 2026-08-26 | Complete; one-job helpers, token generation recommendation, anti-specificity guidance.[5] |
| 6 | Block | `https://cube.fyi/block` | 2026-08-26 | Complete; skeletal/contextual blocks, naming freedom, composition inside blocks.[6] |
| 7 | Exception | `https://cube.fyi/exception` | 2026-08-26 | Complete; concise block deviations and data-attribute guidance.[7] |
| 8 | Grouping | `https://cube.fyi/grouping` | 2026-08-26 | Complete; optional class grouping and recommended readable order.[8] |
| 9 | Examples | `https://cube.fyi/examples` | 2026-08-26 | Complete; external talks, sites, and learning-resource index; no additional normative rules inferred.[9] |
| 10 | Resources | `https://cube.fyi/resources` | 2026-08-26 | Complete; external utility/token tool index; no tool treated as required.[10] |

The documentation calls itself a work in progress.[1] This review therefore records what the current pages say rather than claiming an immutable CUBE specification. External examples and resources were inventoried but were not used to override the methodology pages.[9][10]

## What CUBE actually prescribes

### Core/normative principles

CUBE means **Composition Utility Block Exception**, but its stated core is CSS, not the acronym or Blocks. It embraces cascade and inheritance, prioritizes simplicity and context, and describes itself as an extension of CSS rather than a reinvention.[1][3]

- **Progressive enhancement:** start from a minimum viable experience and let unsupported modern declarations fail forgivingly; avoid unnecessary hacks and micromanagement.[2][3]
- **High-level first:** do as much work as possible through global/inherited CSS, then compositions and utilities, with Blocks and Exceptions reserved for increasing contextual specificity.[2][3][6]
- **Composition:** provide flexible, component-agnostic skeletal layout; govern interaction, flow, and rhythm; do not own color, typography treatment, decoration, or pixel-perfect placement.[4]
- **Utility:** expose a reusable class that does one job well—usually one property or a concise related group—and may project design tokens into HTML reuse.[5]
- **Block:** add a small, recognizable, contextual group of rules after global CSS, compositions, and utilities have done most work. A Block may apply a concise token group and provide a namespace/specificity boost, but should not solve unrelated problems.[6]
- **Exception:** represent a concise deviation from a Block, usually a state change, with a data attribute; if the result is no longer recognizable as the same Block, make a new Block.[7]

### Recommended practices and examples, not universal laws

- Generate token-derived utilities when that maintains a token source of truth; the docs show color/background generation from JSON, but do not require every token/property combination.[5]
- Use a flow rule and contextual `--flow-space` to create rhythm; this is an example of Composition and custom-property context, not a mandatory API name.[4]
- Approach Block internals compositionally so variable content remains supported.[6]
- Keep a Block to a “handful” of rules, with 80–100 lines given as a maximum guideline rather than a machine-verifiable definition of CUBE.[6]
- Group long class attributes for readability and use a consistent order. Square brackets and pipes are examples; the syntax is explicitly adopter-selected.[8]
- Consider data attributes and finite-state-machine thinking for Exceptions, especially when outside influence such as JavaScript changes state.[7]

### Choices CUBE leaves to adopters

CUBE is tool agnostic as long as output is CSS; Sass, Less, PostCSS, and CSS-in-JS are examples, not requirements.[2] It does not prescribe a package graph, file tree, build tool, cascade-layer syntax, class prefix, token format, DTCG authority model, component framework, or runtime model. It explicitly leaves Block element syntax and consistency rules to the team rather than requiring BEM's `__element` form.[6] It also does not prescribe a universal utility count, source-entry strategy, browser matrix, or whether generated utilities live in one file or many.

The official pages do not discuss cascade layers as a formal CUBE mechanism. The layer order proposed below is therefore a Neobrui implementation decision derived from CUBE's stated high-level-to-contextual relationship, not a quoted CUBE `@layer` standard.[2][6][7]

### Assumptions that do not transfer unchanged to Neobrui

1. **Global CSS:** CUBE celebrates a page that still looks good when only global styles arrive.[3] Neobrui is a coexistence-oriented package whose accepted evidence forbids resets and generic element takeover. Adopting CUBE does not authorize changing that boundary.
2. **JavaScript-managed Exceptions:** Neobrui has zero runtime JavaScript in its package. Product JavaScript may set product-owned data attributes, but the CSS package must not introduce a state machine.
3. **Broad token utility generation:** CUBE recommends generated token utilities.[5] Neobrui's finite semantic roles, size budgets, standalone entries, and current personal-project scope make an unrestricted property × token matrix a poor default.
4. **State as generic data attributes:** native pseudo-classes and ARIA already carry semantics for disabled, busy, invalid, focus, and interaction. Duplicating them as generic `data-state` values would weaken the native contract.
5. **Markup grouping punctuation:** bracket/pipe grouping is optional readability advice.[8] It should not become a Neobrui parser, package feature, or required consumer syntax.

## Utilities: first-class, bounded, and not an override weapon

### What belongs in a CUBE-aligned Neobrui utility layer

Admission should require all of the following:

1. one stable job expressed by one property or a concise inseparable group;
2. repeated demand in at least two real contexts or a foundational accessibility need;
3. semantics that are not already owned by a Block, Composition, native HTML, or ARIA;
4. values sourced from semantic tokens or an explicit constant with a documented reason;
5. safe composition with arbitrary Blocks and host CSS;
6. measurable standalone/aggregate size and full affected browser QA;
7. no `!important`, IDs, broad element selectors, or hidden runtime behavior.

**Initial candidate set after an implementation decision, not in this task:**

- `.<prefix>-u-visually-hidden`: one accessibility-oriented hiding job, with focusable/reveal behavior documented separately if needed;
- `.<prefix>-u-wrapper`: centered max-inline-size plus inline padding as one container job, mirroring the official concise-group example while using Neobrui semantic hooks;
- no color, background, spacing, display, alignment, or typography matrix initially. Add a token-derived utility only after repeated product markup proves that the same token/property pairing is intentionally public.

`Stack` and `Cluster` are Compositions, not gap/display utilities. Surface/Button/Field are Blocks, not utility bundles. An Exception varies one Block. This preserves Utility as a real layer without claiming utility-first equivalence.

### Precedence contract

Normal utilities should be emitted **before Blocks**. A Block can therefore establish required geometry, state cues, and accessible presentation without being accidentally erased by a helper. Exceptions follow their Block. Utilities must not use `!important`; the first-party utility page expressly rejects using utilities as a specificity hack.[5]

This differs from frameworks where consumers expect every utility to win. Neobrui should document three intentional override paths instead:

1. a Block's documented custom-property hook for supported local configuration;
2. a product-owned later cascade layer;
3. ordinary unlayered product CSS, which already outranks normal layered kit CSS.

A utility may influence a Block only where the Block deliberately leaves a property inheritable or unclaimed. In particular, utilities must not override `:focus-visible`, `:disabled`, `[aria-disabled="true"]`, `[aria-busy="true"]`, `[aria-invalid="true"]`, forced-colors, or reduced-motion declarations that preserve usable state.

## Neobrui surface mapped to CUBE

| Neobrui surface | CUBE mapping | Boundary |
|---|---|---|
| Semantic token maps and generated CSS | CSS/high-level foundation supporting every later concern; token-derived utilities are optional projections, not token authority. | Keep one canonical authoring source. Generated DTCG and CSS are deterministic views; CUBE does not choose which is canonical. |
| DTCG | Build-time interchange adjacent to token generation, before CSS layers. | It owns neither selectors nor theme state and adds no runtime JS. |
| `Stack` / `Cluster` | Composition. They establish flexible flow/interaction and expose contextual hooks. | No color, font, shadow, motif, or component state. |
| Surface | Block. Visual treatment and finite presentational levels are contextual to a recognizable surface. | Product owns content, meaning, and placement. |
| Button | Block applied to native button/link semantics. | Native `:disabled`, ARIA, focus, reduced motion, and forced-colors contracts remain authoritative; CSS creates no behavior. |
| Field | Block/organizational structure with compositional internal spacing. | Native label/control/description/error semantics remain product markup; checkbox/radio and unproven controls do not appear by architectural fiat. |
| `:hover`, `:active`, `:focus-visible`, `:disabled` | Native state inside the owning Block, not Exceptions. | Never duplicate merely to satisfy CUBE vocabulary. |
| `aria-disabled`, `aria-busy`, `aria-invalid` | Semantic/ARIA state selectors inside the owning Block. | Application remains responsible for correct semantics and behavior. |
| Presentational `data-*` variants | Exceptions only when they are concise deviations from one Block, such as Surface level or fixed shadow direction. | Use a namespaced attribute and finite values; do not create generic application state. |
| Cascade layers | Implementation ordering for CUBE concerns. | Product may predeclare layers and retains later-layer/unlayered control. |
| Product themes | Product-owned token scopes/configured selectors. | Not a Neobrui Exception and not a second theme state machine. |
| Plain CSS, Astro, CSS Modules, Tailwind | Consumption environments for the same emitted CSS architecture. | Existing fixtures prove bounded coexistence, not adapters or universal compatibility. Tailwind utilities and preflight remain product-owned. |
| Standalone/aggregate CSS | Packaging projection of dependencies. | A Block entry imports required tokens plus its Block/Exception rules; aggregate entries can include Compositions/Utilities only when explicitly selected. |
| Zero runtime JS/private package | Compatible implementation choice because CUBE is output/tool agnostic.[2] | Product code may manage state; the package remains CSS-only and unpublished until separately decided. |

## Three decision options

| Criterion | CUBE-primary; ITCSS order as detail | ITCSS/CUBE hybrid as currently proposed | Selective CUBE vocabulary; current recipes/tokens retained |
|---|---|---|---|
| API clarity | Strongest: one public mental model and explicit C/U/B/E ownership. | Medium: useful concepts, but two named architectures invite “which one wins?” questions. | Initially simple, but Composition/Utility/Exception boundaries remain informal. |
| Ordering/specificity | Explicit `tokens → compositions → utilities → blocks → exceptions`; blocks own accessible state. | Current proposal puts utilities after blocks, which risks implying override semantics contrary to the official anti-specificity guidance.[5] | Existing token/recipe order stays predictable; future utilities require a new decision. |
| Namespace burden | One prefix; category visible mainly in docs/layers, with `u-` only where useful. | Risk of parallel “layout/recipe/block” aliases and redundant vocabulary. | Lowest immediate churn, but temporary `_nb-spike` names still require replacement. |
| Utility growth | First-class governance makes additions visible and demand-gated. | “Minimal utilities” can remain underspecified and be treated as optional leftovers. | Lowest near-term growth, but repeated ad hoc product helpers are likely. |
| Package/tree-shaking surface | CSS subpaths can expose foundations, compositions, utilities, and Blocks; CSS imports remain static rather than JS tree shaking. | Similar possible graph, but duplicated terminology complicates entry naming. | Keeps current entries; no explicit Composition/Utility entries until later. |
| Documentation complexity | Moderate upfront rewrite; lower long-term conceptual ambiguity. | Highest: explain ITCSS, CUBE, recipes, layouts, and where each applies. | Lowest now; higher when Stack/Cluster and reusable helpers arrive. |
| Migration cost | Moderate documentation, layer, entry, and provisional-selector migration; no current public compatibility promise. | Lowest relative to ADR-009, but requires utility-order correction or explicit override policy. | Lowest immediate cost; postpones architecture debt. |
| Browser/QA implications | Layer order, imports, states, custom-property hooks, RTL/writing modes, and every configured browser need regression coverage. No new runtime matrix. | Similar, plus ambiguity makes hostile-order fixtures harder to specify. | Smallest immediate QA delta; each later primitive still needs isolated expansion tests. |
| Fit for personal projects | Best if kept small: shared language without framework ambition. | Adequate but overnamed for a one-owner kit. | Good only if expansion stops at current recipes; weaker for approved Stack/Cluster and shared helpers. |

**Why not retain the hybrid label?** ITCSS contributes useful low-to-high ordering, but CUBE already supplies the consumer-facing concern model and explicitly depends on cascade/context. Neobrui can use layer ordering without making adopters learn a second architecture name. “CUBE-primary” also makes Ryan's correction durable: Utility is not a decorative afterthought.

**Why not selective vocabulary only?** It is rational if Neobrui freezes at tokens plus three recipes. ADR-009, however, proposes Stack/Cluster, DTCG interchange, and controlled utilities. At that point explicit concern boundaries reduce drift enough to justify the modest migration.

## Concrete CUBE-primary proposal

### Emitted order

```css
@layer <prefix>.tokens,
       <prefix>.compositions,
       <prefix>.utilities,
       <prefix>.blocks,
       <prefix>.exceptions;
```

1. **tokens:** generated semantic custom properties in configured, opt-in scopes; no reset or element takeover;
2. **compositions:** flexible structural rules that should remain visually neutral;
3. **utilities:** bounded one-job helpers, before Blocks and without `!important`;
4. **blocks:** Surface/Button/Field context and accessible presentation;
5. **exceptions:** concise presentational deviations tied to a Block.

The order follows CUBE's description that high-level CSS, Composition, and Utility do most work before a Block adds contextual rules, with Exception as the final Block deviation.[2][6][7] Separate layers make the contract inspectable; they are an ITCSS-like implementation technique, not an additional public methodology.

### Names and hooks (illustrative only)

CUBE does not require naming syntax.[6] Unless Ryan approves a real prefix, examples remain placeholders:

- Compositions: `.<prefix>-stack`, `.<prefix>-cluster`;
- Blocks: `.<prefix>-surface`, `.<prefix>-button`, `.<prefix>-field`;
- Utility distinction where useful: `.<prefix>-u-wrapper`, `.<prefix>-u-visually-hidden`;
- Exceptions: `[data-<prefix>-level="raised"]`, `[data-<prefix>-shadow-direction="fixed"]` scoped to the owning Block;
- hooks/tokens: `--<prefix>-stack-gap`, `--<prefix>-cluster-gap`, `--<prefix>-button-background`, `--<prefix>-color-focus`;
- product theme example only: `[data-theme="dark"]` or another product-owned configured selector, not a library-owned `data-<prefix>-theme` requirement.

This supports the existing `nbr-` recommendation but does not approve it. CUBE adds no reason to prefer `nbr-` over another concise owned prefix; it only reinforces consistent names and contextual namespaces.[6][8]

### Composition APIs

```css
.<prefix>-stack {
  display: flex;
  flex-direction: column;
  gap: var(--<prefix>-stack-gap, var(--<prefix>-space-flow));
}

.<prefix>-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--<prefix>-cluster-gap, var(--<prefix>-space-cluster));
  align-items: var(--<prefix>-cluster-align, center);
  justify-content: var(--<prefix>-cluster-justify, flex-start);
}
```

Both are content-agnostic and visually neutral, matching Composition's job of flexible layout, interaction, flow, and rhythm.[4] They should not reset child margins, color, typography, borders, or shadows. Hooks are local configuration; a small set of documented keyword constraints is preferable to modifier matrices. QA must cover nesting, 320px, long content, RTL, vertical writing modes where supported, source/layer order, and hook overrides in Chromium, Firefox, and WebKit.

### Block APIs

- `.<prefix>-surface`: preserve quiet/outlined/raised presentation, semantic token use, no layout ownership beyond the Block's own box, and forced-colors resilience.
- `.<prefix>-button`: style native button and link roles without inventing behavior. Keep native/ARIA selectors in the Block layer so utilities cannot erase focus, disabled, busy, reduced-motion, or forced-colors cues.
- `.<prefix>-field`: keep wrapper/control/description/error organization together; use a Composition internally for rhythm where that genuinely generalizes, but do not expose unsupported control coverage.

Blocks should stay recognizable and narrow. The official line-count guidance can be used as a review smell, not a hard build failure; Button's accessibility/media-query rules may legitimately make physical line count a poor proxy.[6]

### Exception decision rule

Use, in order:

1. **native pseudo-class or ARIA selector** when HTML already represents semantic state;
2. **namespaced data attribute** for a finite, inspectable, presentational Block deviation caused by product state/configuration;
3. **custom-property hook** for local continuous or compositional configuration that should not multiply selectors;
4. **modifier class** only for a stable named Block style that is neither semantic state nor exceptional; if it is a substantial identity change, prefer another Block. Do not call modifier classes CUBE Exceptions because the first-party guidance says Exceptions use data attributes and should not use CSS classes.[7]
5. **product-owned selector** for one-off application context, theme scope, content semantics, or unsupported behavior. Do not pull every product exception into the package.

A generic `data-state` API is not proposed. Prefer finite namespaced attributes tied to one Block, and never mirror `disabled`, `busy`, `invalid`, or focus merely to make an “Exception” visible in documentation.

### Generation and product ownership

The canonical JS/TS-versus-DTCG decision remains independent of CUBE. Whichever Ryan chooses, resolve and validate semantic roles once, emit deterministic DTCG and CSS, and place generated token CSS in the token layer. Utility generation consumes the same resolved model but emits only an approved allowlist. There must be no independently editable utility token source.

Products continue to own palettes, fonts, content, motifs, theme state/selectors, JavaScript, routes/actions, semantic markup, unsupported exceptions, Tailwind configuration/preflight, Astro import placement, CSS Modules locals, and adoption timing.

## Likely misapplications and guardrails

- **Four folders only:** CUBE is a CSS/cascade/context methodology; renaming directories without changing ownership and precedence is not adoption.[1][3]
- **Utility-first equivalence:** Utility is first-class, but CUBE also relies on high-level CSS, Composition, small Blocks, and Exceptions. The docs do not require a class-per-declaration consumer API.[2][5][6]
- **Generated explosion:** a recommendation to generate token utilities is not permission to emit every token against every property.[5] Use an allowlist, demand evidence, size budgets, and removal criteria.
- **Modifier explosion:** if an Exception changes a Block beyond recognition, create another Block; do not produce combinatorial variants.[7]
- **Semantic-state duplication:** use native/ARIA selectors before data attributes. A CSS methodology cannot improve semantics by shadowing them.
- **Accessible-state override:** utilities precede Blocks, omit `!important`, and cannot defeat focus/disabled/invalid/busy/forced-colors/reduced-motion rules.[5]
- **Global takeover:** CUBE's global-first assumption does not supersede Neobrui's opt-in package contract. Any reset or generic element rules require a separate ADR and coexistence evidence.[3]
- **Naming dogma:** CUBE leaves element syntax to adopters.[6] Do not add BEM-like category encoding unless it improves Neobrui's actual API.
- **Grouping as syntax:** square brackets/pipes are optional authoring conventions and must not become a runtime/parser contract.[8]

## Effect on existing ADR-009 decisions

| Existing decision | CUBE review effect |
|---|---|
| `nbr-` recommendation | No change; still a reasonable pending candidate. Use one owned prefix consistently, but CUBE supplies no specific prefix. |
| Cascade layers/order | Change proposed order to `tokens → compositions → utilities → blocks → exceptions`; rename `recipes` to `blocks` only if Ryan adopts the public CUBE vocabulary. |
| Stack/Cluster hooks | Confirm as Compositions with custom-property hooks and token defaults; keep them visually neutral and avoid utility matrices. |
| DTCG/generated tokens | No authority change. Add an explicit utility allowlist projection from the same resolved token model if utilities are implemented. |
| Standalone CSS entries | Preserve foundations and per-Block entries. Add Composition/Utility subpaths only when real consumers need them; aggregate dependencies must be explicit and deterministic. |
| Package size budgets | Keep current budgets and add separate measured rows for Compositions, Utilities, and the changed aggregate. Utility growth gets a budget and kill/narrow conditions. |
| HTML Day Lite path | Keep neutral site first, then a bounded Surface/Button/Cluster slice. Add one candidate utility only if the slice proves repeated need; do not force class grouping syntax or migrate all markup. |
| Zero runtime/private boundary | No change; CUBE is compatible with CSS-only output and does not require publication or package JavaScript.[2] |

## ADR-009 changes if Ryan accepts this recommendation

Keep ADR-009 `Proposed` until Ryan decides. On acceptance, amend the proposal text—not implementation in the same decision—to:

1. replace “small ITCSS/CUBE hybrid” with “CUBE-primary; ITCSS-style cascade ordering is an implementation detail”;
2. define the five-layer order exactly as `tokens, compositions, utilities, blocks, exceptions`;
3. state that Utility is first-class but allowlisted, demand-gated, budgeted, and not `!important`/override-first;
4. rename the conceptual `recipes` concern to `blocks`, while preserving migration wording for existing recipe file/entry names until implementation;
5. state native/ARIA selectors belong to Blocks and are not duplicated as Exceptions;
6. define namespaced data attributes as finite presentational Exceptions and custom properties as local configuration hooks;
7. preserve the reset-free/opt-in global contract as a deliberate Neobrui adaptation;
8. require Composition/Utility/Block/Exception size and full browser/coexistence checks;
9. keep DTCG authority, namespace, package posture, and adopter choices separately pending.

## Decisions still requiring Ryan

1. Adopt CUBE-primary, retain the hybrid label, or freeze at selective vocabulary.
2. Approve the stable prefix (`nbr-` remains the recommendation, not a decision).
3. Approve the five public layer names and whether existing `recipes` entry filenames migrate to `blocks` or remain compatibility-oriented internal names.
4. Approve the initial utility allowlist; specifically whether to ship no utilities until adopter proof, or begin with visually-hidden and wrapper.
5. Approve Stack/Cluster default tokens and constrained hook values.
6. Approve canonical token authority and the exact DTCG format/theme organization.
7. Confirm product theme-selector convention and nested fallback.
8. Confirm package/source/release posture and the HTML Day Lite evidence threshold.

## Implementation and migration sequence after acceptance

1. Record Ryan's architecture, prefix, layers, utility allowlist, token authority, and Stack/Cluster choices in an Accepted follow-up or revised ADR.
2. Specify a dependency graph for foundations, Compositions, Utilities, each Block, each Exception, aggregate entries, and generated DTCG; define old-to-new provisional name mapping without promising `_nb-spike` aliases.
3. Add RED tests for exact layer order, native/ARIA state precedence, absence of resets/`!important`, deterministic generation, subpath contents, and size rows.
4. Implement token/DTCG generation and the utility allowlist from one resolved source.
5. Implement Stack/Cluster, then migrate Surface/Button/Field into Block/Exception layers without selector behavior changes beyond the approved namespace/layer contract.
6. Run unit, deterministic archive/consumer, CSS coexistence, size, and full Chromium/Firefox/WebKit checks; retain manual accessibility limitations.
7. Prove a neutral consumer, then the bounded HTML Day Lite slice side-by-side with rollback.
8. Expand Utilities, Blocks, or Exceptions only from repeated consumer evidence.

## Stop or narrow conditions

- Stop CUBE-primary adoption if the five-layer graph measurably complicates standalone consumption without reducing consumer ambiguity.
- Ship zero or one utility if the initial allowlist adds no repeated value, exceeds its size budget, or conflicts with Block state.
- Narrow Stack/Cluster hooks if combinations become a utility/modifier matrix or fail RTL/writing-mode/nesting checks.
- Reject a proposed Exception if native HTML/ARIA already expresses it, it requires package JavaScript, or it makes the Block unrecognizable.
- Preserve current recipe entry names internally if a rename creates churn without public API benefit; architecture vocabulary need not force file churn.
- Stop the HTML Day Lite migration on accessibility, browser-matrix, package-size, or rollback regressions.
- Do not move ADR-009 to Accepted, publish, push, or broaden support claims without Ryan's explicit decisions.

## Conclusion

CUBE is a strong fit for Neobrui **as the primary thinking and API architecture**, provided Neobrui adapts CUBE's global-first assumption to its established opt-in package boundary. The decisive correction is to treat Utility as a governed first-class layer before Blocks, not as a late override bucket. ITCSS remains useful as the explanation for low-to-high ordering but does not need equal billing. This produces a small personal CSS kit—not a utility-first framework—with tokens feeding flexible Compositions, bounded Utilities, accessible Blocks, and explicit Exceptions.

## Sources

[1] https://cube.fyi
    > "CUBE stands for Composition Utility Block Exception."
[2] https://cube.fyi/principles
    > "The overarching principle of CUBE CSS is simplicity."
[3] https://cube.fyi/css
    > "With CUBE CSS, we embrace the cascade and inheritance to style as much as possible at a high level."
[4] https://cube.fyi/composition
    > "The composition layer’s job is to create flexible, component-agnostic layout systems that support as many variants of content as possible."
[5] https://cube.fyi/utility
    > "A utility, in the context of CUBE CSS, is a CSS class that does one job and does that one job well."
[6] https://cube.fyi/block
    > "A block is a skeletal component or organisational structure."
[7] https://cube.fyi/exception
    > "An exception is a deviation from the rules outlined in a block."
[8] https://cube.fyi/grouping
    > "The important thing is that related classes are grouped together"
[9] https://cube.fyi/examples
    > "The best place to start—if you haven’t already—is the high level overview post"
[10] https://cube.fyi/resources
    > "Some links to resources that will help you with CUBE CSS."
