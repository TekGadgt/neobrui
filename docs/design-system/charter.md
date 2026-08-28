# Neobrui design-language charter

Status: proposed authoritative design charter for review  
Date: 2026-08-27  
Scope: design authority and candidate API boundaries; no implementation or publication authorization

## How to read this charter

**[Definition]** Every normative statement is labeled with both force and provenance:

- **MUST** — required for a conforming Neobrui design.
- **SHOULD/default** — the expected choice; departure needs a project-specific reason.
- **MAY/option** — supported but not required.
- **AVOID** — prohibited by default; use only with explicit evidence and review.
- **[Ryan]** — Ryan-specific product decision; not a universal claim about Neobrutalism.
- **[Accessibility]** — requirement or safeguard grounded in standards/guidance.
- **[History]** — contextual claim, not a Neobrui prescription.
- **[Repository evidence]** — observed current or pilot behavior.
- **[Recommendation]** — proposed charter/API decision awaiting acceptance.
- **[Definition]** — charter terminology, scoring definitions, and structural framing.

**[MUST][Definition]** Every normative clause MUST carry exactly one force label; compound clauses with different forces MUST be split. Factual, definitional, historical, product, repository-evidence, example, and explanatory assertions MUST carry a provenance label even when no normative force applies. Headings, table column labels, source handles, and fenced code excerpts are structural rather than assertions.

## Decision summary — choices Ryan still needs to make

**[Recommendation]** The recommended-default and consequence columns below are proposed judgments.  
**[MUST][Ryan]** Ryan MUST resolve each item in the exact-decision column before implementation; the table entries inherit this force and provenance.

| Choice | Recommended default | Exact decision required before implementation | Consequence |
|---|---|---|---|
| Naming density | **Hybrid semantic** | Approve `nbr-` names; Compositions are `.nbr-stack/.nbr-cluster/.nbr-wrapper/.nbr-grid`; primitives are `.nbr-surface/.nbr-pressable/.nbr-field`; only Utility gets `nbr-u-`. Reject a broad class-per-property matrix. | Keeps markup readable while retaining composition and one-job helper reuse. |
| Primitive set | **Surface + Pressable; Field conditional** | Ship Surface and Pressable in v0; include Field only if two real forms need its coordinated label/control/error contract. Decide whether public docs call it `Pressable` while the class remains `.nbr-button`, or rename the class `.nbr-pressable`. | Prevents recipes from repeating fragile state CSS without growing a component catalog. |
| Palette posture | **No required house palette** | Approve neutral semantic fallback values versus requiring every consumer to define all color roles. Recommended: safe neutral fallbacks for demos, with product scopes overriding roles; no yellow/pink/blue brand bundle in core. | Projects retain identity; examples remain runnable. |
| Shadow direction | **Logical by default** | Approve down-and-inline-end as default with scoped fixed-physical escape, or choose fixed down-right only. Recommended: logical default and `[data-nbr-shadow-direction="fixed"]` escape. | Fixes RTL/press geometry and test obligations before API freeze. |
| Skill location/format | **`skills/neobrui/SKILL.md`** | Approve this visible repo-owned path with `references/` and `templates/`; optionally add one-line pointers from `AGENTS.md` or tool-specific files without duplicating rules. | Gives humans and agents one canonical source without profile installation. |
| Migration treatment | **One clean break** | Approve one simplification branch that archives only decision-worthy historical evidence, deletes generated/custom release machinery not retained, and provides no compatibility aliases because no registry release exists. | Avoids preserving pilot complexity as public API debt. |

**[MUST][Ryan]** Implementation does not begin until all six choices above are recorded in one reviewed decision.  
**[MUST][Ryan]** Starlight remains the documentation shell.  
**[AVOID][Ryan]** Do not treat package size, utility-token count, LOC, or milliseconds as the primary success definition; they are secondary maintenance signals.

---

## 1. Purpose and opt-in boundary

**[Ryan]** Neobrui is Ryan’s centralized, public, opt-in Neobrutalism design system: a reusable grammar for reproducing his preferred visual language while allowing each product to remain itself.

- **[MUST][Ryan]** Neobrui MUST codify principles, foundations, tools, recipes, and an AI contract as one coherent design authority.
- **[MUST][Ryan]** Adoption MUST be explicit, scoped, reset-free, removable, and reversible.
- **[MUST][Ryan]** Importing Neobrui MUST NOT globally restyle `html`, `body`, headings, links, buttons, fields, or native controls.
- **[MUST][Ryan]** A consumer MUST apply an opt-in class or configured theme scope before Neobrui affects presentation.
- **[MUST][Ryan]** A non-Neobrutalist project MUST remain unaffected merely because Neobrui is installed or imported.
- **[SHOULD/default][Ryan]** A project SHOULD adopt only the Neobrui concerns it needs rather than the aggregate entry by habit.
- **[MAY/option][Ryan]** A project MAY remove every Neobrui class and theme mapping while preserving semantic HTML and application behavior.
- **[AVOID][Ryan]** Do not market Neobrui as the correct style for every Ryan project.

**[Ryan]** Success means recognizable fidelity, internal consistency, reuse of design decisions, lower decision cost, and reliable reproduction by humans and agents.  
**[Repository evidence]** The current repository proves a reset-free CSS-only boundary and native ownership for semantics, but its private alpha architecture is evidence rather than the desired final shape.[R1][R2]

## 2. Ryan’s Neobrutalism principles

**[History]** Architectural Brutalism contributes a limited metaphor of clear structure, memorable image, and materials “as found”; web brutalism later became a broad, contested response to polished conventions.[1][2][3]

**[History]** Published histories describe multiple web-brutalist tendencies rather than one stable visual recipe.[4]  
**[Ryan]** Neobrui treats contemporary Neobrutalism as a polished UI vocabulary, not as a claim of direct architectural lineage.

- **[MUST][Ryan]** Visible construction MUST carry meaning: border, fill, shadow, type, spacing, and motion each communicate hierarchy or state.
- **[MUST][Ryan]** Interfaces MUST have a strong visible hierarchy before decorative treatment is added.
- **[SHOULD/default][Ryan]** Typography SHOULD be bold and compact at display/label levels while body reading remains calm.
- **[SHOULD/default][Ryan]** Focal surfaces SHOULD use thick boundaries and hard, unblurred offset shadows to create tactile depth.
- **[SHOULD/default][Ryan]** Palettes SHOULD be high-energy but bounded by named roles.
- **[SHOULD/default][Ryan]** Corners SHOULD be square or use a small radius; large soft rounding is an explicit product choice.
- **[MUST][Ryan]** Focus and interaction states MUST be obvious without relying on the shadow alone.
- **[MUST][Ryan]** Native semantic controls MUST be the starting point.
- **[MUST][Ryan]** Product identity MUST outrank resemblance to a Neobrui demo.
- **[SHOULD/default][Ryan]** At least 30–50% of visible regions SHOULD remain quiet: unframed, rule-only, or low-chroma.
- **[AVOID][Ryan]** Do not put a border, shadow, accent fill, uppercase label, or motion effect on every element.
- **[AVOID][Ryan]** Do not reproduce a fashionable yellow/pink/blue palette, retro font, stickers, or grid-paper motif unless the product owns that choice.

**[Ryan]** Restraint is not dilution: it concentrates the signature on the page heading, primary task region, primary action, selected state, or one identity-bearing artifact so those elements lead instead of competing.

## 3. Foundations/tokens

- **[MUST][Recommendation]** Foundations MUST be directly authored CSS custom properties and MUST remain the only editable authority.
- **[MAY/option][Recommendation]** Build-time formats MAY export Foundations for interchange.
- **[MUST][Recommendation]** Public tokens MUST name semantic roles, not project colors or component locations.
- **[MUST][Recommendation]** Every public custom property MUST use `--nbr-` if Ryan approves the proposed namespace.
- **[SHOULD/default][Recommendation]** The initial role families SHOULD be:

| Family | Candidate roles |
|---|---|
| Color | `--nbr-color-canvas`, `surface`, `surface-raised`, `text`, `text-muted`, `border`, `shadow`, `action`, `on-action`, `focus`, `positive`, `warning`, `negative` |
| Border/radius | `--nbr-border-rule`, `control`, `region`; `--nbr-radius-none`, `small` |
| Shadow | `--nbr-shadow-inline`, `block`, `small-inline`, `small-block`, `press-inline`, `press-block` |
| Space/size | `--nbr-space-1` through `--nbr-space-6`; `--nbr-size-content`, `wide`, `control-min` |
| Type | `--nbr-font-body`, `display`, `mono`; `--nbr-text-body`, `label`, `heading`, `display` |
| Focus/motion | `--nbr-focus-width`, `offset`; `--nbr-motion-fast`, `moderate`, `press-ease` |

- **[MUST][Recommendation]** Role tokens MUST support nested product scopes without requiring a library-owned theme state attribute.
- **[MUST][Ryan]** Products MUST own actual palette, typefaces, imagery, motifs, theme toggles, persistence, and application meanings.
- **[SHOULD/default][Recommendation]** Primitive-local hooks SHOULD exist only for values a product repeatedly needs to remap, such as `--nbr-surface-background`, `--nbr-pressable-background`, `--nbr-field-background`, and composition gaps.
- **[AVOID][Recommendation]** Do not expose arbitrary raw color, padding, margin, radius, and shadow props/classes on every instance.
- **[MAY/option][Recommendation]** A DTCG artifact MAY be generated for interchange after a consumer proves value.
- **[MUST][Recommendation]** Any DTCG artifact MUST remain non-runtime and non-authoritative unless Ryan explicitly reverses this decision.

## 4. Layout and composition grammar

- **[MUST][Ryan]** Collections MUST express content hierarchy rather than defaulting to walls of equal cards.
- **[MUST][Ryan]** “Intentional irregularity” means varying span, size, alignment, rhythm, and emphasis according to content importance; it MUST remain structured, legible, and purposeful.
- **[AVOID][Ryan]** Do not use random offsets, broken alignment, reordered reading flow, overlap that hides content, or breakpoint accidents as “irregularity.”
- **[SHOULD/default][Recommendation]** The layout tool set SHOULD contain `Stack`, `Cluster`, `Wrapper`, and an intentionally irregular `Grid` Composition.
- **[SHOULD/default][Recommendation]** Compositions SHOULD own flow, wrapping, measure, and gap—not color, type, borders, shadows, or application state. This matches the useful CUBE distinction between flexible composition and one-job utility without requiring the final product to teach CUBE history.[17][18]

**[Recommendation]** The candidate Composition contracts are:

| Composition | Candidate class | Contract |
|---|---|---|
| Stack | `.nbr-stack` | Vertical flow; one gap hook; no child-margin reset or reordering. |
| Cluster | `.nbr-cluster` | Wrapping inline flow; bounded gap/alignment/justification hooks. |
| Wrapper | `.nbr-wrapper` | Centered max measure plus logical inline padding; no global page ownership. |
| Grid | `.nbr-grid` | Intrinsic columns plus optional named span/emphasis hooks; equal cards are one mode, not the default demo. |

- **[MUST][Recommendation]** Grid examples MUST state why an item spans or leads.
- **[SHOULD/default][Recommendation]** A project gallery SHOULD make a featured case study span two columns, give current work a larger image/title rhythm, and render secondary notes as quiet single cells.
- **[SHOULD/default][Recommendation]** An editorial page SHOULD allow the hero, pull quote, image, and related links to align differently while retaining a shared outer grid.
- **[MUST][Accessibility]** Source order MUST remain meaningful when CSS is removed and at narrow widths.
- **[MUST][Accessibility]** At 320 CSS px-equivalent width, mixed spans MUST collapse to one task-ordered column or a simple bounded arrangement without accidental two-dimensional scrolling.[11]
- **[SHOULD/default][Recommendation]** Responsive fallback SHOULD remove ornamental offsets, reduce large shadows/gaps, and keep primary action/result proximity.
- **[MAY/option][Recommendation]** One secondary item MAY remain offset or inset on mobile if it does not create overflow or separate related controls.

**[Recommendation]** Good example: a portfolio grid gives the most consequential project a 2×2 span, current work a full-width strip, and talks/notes smaller cells; mobile becomes project → evidence → related notes. Bad example: twelve identically raised cards whose only variation is random color.

## 5. Surface and shape grammar

- **[SHOULD/default][Ryan]** Surface levels SHOULD be `quiet`, `outlined`, and `raised`.
- **[MUST][Ryan]** Quiet MUST be a first-class treatment, not the absence of design.
- **[SHOULD/default][Ryan]** `outlined` SHOULD mark a meaningful group or boundary without implying elevation.
- **[SHOULD/default][Ryan]** `raised` SHOULD be reserved for focal task regions, primary cards, or objects that benefit from tactile separation.
- **[MUST][Ryan]** Hard shadows MUST be unblurred and paired with an independent visible boundary where the boundary matters.
- **[SHOULD/default][Ryan]** Border weight SHOULD create hierarchy: thin rule, control boundary, then structural region boundary.
- **[SHOULD/default][Ryan]** Radius SHOULD default to zero or small.
- **[MAY/option][Ryan]** A product MAY override the radius consistently.
- **[AVOID][Ryan]** Do not put the same border width, fill, shadow depth, and radius on page shell, card, control, badge, and metadata.
- **[AVOID][Accessibility]** Do not encode state, reading order, or meaning only through shadow direction or depth.

## 6. Typography and hierarchy

- **[MUST][Ryan]** Every page MUST have one unmistakable primary heading and a distinguishable body/label/meta hierarchy.
- **[SHOULD/default][Ryan]** Display type SHOULD be bold, compact, and limited to short copy.
- **[MAY/option][Ryan]** Heading line-height MAY be tight and tracking MAY be assertive when legibility survives.
- **[MUST][Ryan]** Body type MUST retain readable line-height, measure, case, and weight.
- **[SHOULD/default][Ryan]** Uppercase and monospaced treatments SHOULD be reserved for compact labels, status, metadata, or technical annotation.
- **[AVOID][Ryan]** Do not make headings, labels, navigation, body copy, and statuses equally heavy or uppercase.
- **[MUST][Accessibility]** Headings and labels MUST describe topic or purpose.[13]
- **[MUST][Accessibility]** Text MUST remain usable at 200% resize without loss of content or function.[10]
- **[MUST][Ryan]** Neobrui MUST NOT bundle a required font.

## 7. Color and contrast

- **[MUST][Ryan]** Colors MUST be assigned to stable foreground, canvas, surface, action, focus, and status roles.
- **[SHOULD/default][Ryan]** A product SHOULD begin with a paper/canvas role, an ink/text role, and a bounded accent set.
- **[SHOULD/default][Ryan]** High-energy accents SHOULD identify actions, active work, or a stable product meaning rather than decorate arbitrary cards.
- **[MUST][Accessibility]** Normal text MUST meet at least 4.5:1 contrast and large text at least 3:1 where WCAG 2.2 applies.[5]
- **[MUST][Accessibility]** Meaningful control boundaries, focus/state indicators, and graphical information MUST meet applicable 3:1 non-text contrast requirements.[6][7]
- **[MUST][Accessibility]** Color MUST NOT be the only state or status cue.
- **[MUST][Accessibility]** Forced-colors presentation MUST retain system-visible borders, focus, invalid, selected, and disabled cues.[15]
- **[MAY/option][Accessibility]** Decorative shadows MAY disappear in forced-colors presentation.[15]
- **[MAY/option][Ryan]** A product MAY use a fixed branded palette, light/dark role remapping, or multiple nested themes.
- **[AVOID][Ryan]** Do not invert an entire palette mechanically or assume saturation implies contrast.

## 8. Interaction and motion

- **[MUST][Ryan]** Interactive elements MUST visibly distinguish default, hover where applicable, active, focus-visible, disabled, invalid, selected/open, and busy states that apply.
- **[MUST][Accessibility]** Every operation MUST remain keyboard-operable.[8]
- **[MUST][Accessibility]** Focus MUST be independent from hover and shadow, visibly unclipped, and robust in forced colors.
- **[SHOULD/default][Recommendation]** Tactile controls SHOULD use a single coherent model: rest has a hard offset; active moves toward the shadow and reduces/collapses it; keyboard focus does not trigger pointer translation.
- **[MAY/option][Recommendation]** Pointer hover MAY lift a tactile control slightly away from its shadow.
- **[MUST][Recommendation]** Shadow offset and active translation MUST use the same direction/sign convention.
- **[SHOULD/default][Recommendation]** Default shadow intent SHOULD be down-and-inline-end, reversing the inline offset and matching press translation under the nearest RTL direction root.
- **[MAY/option][Recommendation]** A product with a physical light-source art direction MAY opt a theme/subtree into fixed down-right shadows.
- **[MUST][Recommendation]** The fixed versus logical choice MUST be scoped, documented, and tested; it MUST NOT be an arbitrary per-button direction prop.
- **[SHOULD/default][Ryan]** Motion SHOULD explain cause and effect and remain short.
- **[MUST][Accessibility]** Nonessential interaction animation MUST be removed or made non-motion under reduced-motion preferences.[9][16]
- **[AVOID][Ryan]** Do not use repeated entrances, jitter, parallax, or translation merely to make the style feel energetic.

## 9. Accessibility and native semantics

- **[MUST][Accessibility]** Native HTML MUST provide element roles, names, labels, keyboard behavior, validation, and state wherever it can.
- **[MUST][Accessibility]** A button action MUST use `button`; navigation MUST use a link; a generic Surface MUST NOT become clickable through CSS alone.
- **[MUST][Accessibility]** Fields MUST have programmatic labels and applicable descriptions/errors; visual placement does not create those relationships.
- **[MUST][Accessibility]** Stateful composite widgets MUST NOT be claimed by a CSS-only package; APG patterns demonstrate distinct keyboard/state obligations for dialogs, menus, tabs, tooltips, and similar composites.[14]
- **[MUST][Accessibility]** Primary controls MUST meet the applicable WCAG 2.2 target-size minimum or spacing exception.[12]
- **[SHOULD/default][Accessibility]** Products SHOULD use a larger target-size default where feasible.[12]
- **[MUST][Accessibility]** Released examples MUST be checked at 320px reflow, 200% text resize, and keyboard-only operation.[8][10][11]
- **[MUST][Accessibility]** Released examples MUST also be checked for focus visibility, forced colors, reduced motion, and the supported engine matrix.[7][9][15]
- **[SHOULD/default][Accessibility]** Automated axe/DOM checks SHOULD be combined with keyboard and targeted manual assistive-technology review; automation alone is not a conformance claim.
- **[AVOID][Ryan]** Do not market “fully accessible” or “WCAG compliant” without a scoped, dated conformance evaluation.

## 10. Utilities/compositions/primitives boundary

**[Recommendation]** Neobrui’s candidate system has five layers of authority, not five mandatory build layers:

A. **Principles** — canonical prose rules and good/bad examples.  
B. **Foundations** — semantic CSS custom properties and scales.  
C. **Tools** — bounded Compositions, true Utilities, and a small semantic primitive set.  
D. **Recipes** — copyable native-HTML assemblies owned by consumers.  
E. **AI contract** — condensed decision and verification procedure.

- **[MUST][Recommendation]** Composition MUST own reusable layout relationships; Utility MUST do one stable job; Primitive MUST own coordinated visual states that would be noisy or fragile as utilities; Recipe MUST demonstrate assembly without becoming package API.
- **[SHOULD/default][Recommendation]** Initial Compositions SHOULD be Stack, Cluster, Wrapper, and irregular Grid.
- **[SHOULD/default][Recommendation]** Initial Utility SHOULD be `.nbr-u-visually-hidden` only.
- **[MAY/option][Recommendation]** A truly single-purpose signature helper MAY be admitted after two independent consumers demonstrate repetition and safe composition.
- **[SHOULD/default][Recommendation]** Hard shadow, border, and press behavior SHOULD remain primitive concerns until that evidence exists.
- **[SHOULD/default][Recommendation]** Candidate primitives SHOULD be Surface and Pressable.
- **[MAY/option][Recommendation]** Field MAY join only when coordinated label/control/error styling and value/state preservation prove reuse.
- **[AVOID][Recommendation]** Do not expose a generated spacing/color/display/alignment matrix, modifier explosion, `!important` override layer, or raw property-per-class API.

**[Repository evidence]** The corrected HTML Day pilot invalidated broad standalone utility ownership for that product slice: truthful transfer required **25 added utility tokens**, a package/vendor/import/token bridge, cascade ownership work, **14 additional application stylesheet lines**, and changed interaction values; it was more verbose than semantic component classes.[R3]  
**[Repository evidence]** The full declared Playwright matrix was exercised, but this was not a clean-suite result: **77 passed, 7 skipped, and one flaky mobile-Chrome gutter failure that passed only when rerun in isolation**. The pilot records the failure as unrelated to the Step 3 controls and non-reproducing in isolation.[R3]  
**[Recommendation]** This is evidence against broad utility ownership as Neobrui’s default—not evidence that utilities are inherently bad. Visually hidden and genuinely repeated one-job helpers still have clear ownership; layout Compositions remain useful; Pressable is justified precisely because coordinated focus/disabled/active/RTL/reduced-motion states are noisy as independent utility tokens.

## 11. Pattern recipes

- **[MUST][Recommendation]** Recipes MUST use native HTML, show exact classes/tokens, state who owns behavior, and be copyable without becoming a versioned component API.
- **[MUST][Recommendation]** Every recipe MUST include purpose, anatomy, good/bad example, responsive behavior, semantics, states, theming hooks, and a removal note.
- **[SHOULD/default][Recommendation]** Initial recipe set SHOULD include cards, alerts/callouts, badges/status labels, nav/toolbars, editorial sections, hero, and mixed-span content grid.
- **[SHOULD/default][Recommendation]** A card recipe SHOULD support quiet, outlined, or raised Surface treatment according to hierarchy; clickable cards SHOULD use one coherent link target and avoid nested controls.
- **[SHOULD/default][Recommendation]** Alert and badge recipes SHOULD pair tone with text/icon/label and leave urgency/live-region semantics to the application.
- **[SHOULD/default][Recommendation]** Nav and toolbar recipes SHOULD distinguish site navigation from application command toolbars; the latter becomes a packaged primitive only if keyboard behavior is intentionally owned.
- **[SHOULD/default][Recommendation]** Hero and editorial recipes SHOULD demonstrate asymmetric composition, not merely large type inside equal cards.
- **[MAY/option][Recommendation]** A recipe MAY graduate to a primitive after repeated cross-project adoption proves a stable coordinated-state contract.

## 12. Anti-patterns and failure modes

- **[AVOID][Ryan]** Equal-loudness card walls, unrestricted rainbow fills, universal heavy borders, identical shadows, and every-label-uppercase typography.
- **[AVOID][Ryan]** Random asymmetry that does not express content hierarchy.
- **[AVOID][Accessibility]** Div-as-button, clickable generic Surface, nested interactive controls, hover-only function, color-only state, shadow-only focus, positive `tabindex`, and CSS-only composite claims.
- **[AVOID][Recommendation]** Broad utility matrices whose markup/cascade bridge costs exceed removed product CSS.
- **[AVOID][Recommendation]** Framework adapters before two independent consumers show repeated integration need.
- **[AVOID][Ryan]** Product motifs, palette names, fonts, stickers, icons, illustrations, or application meanings in core.
- **[AVOID][Recommendation]** Post-build DOM rewriting, Starlight component forks, or custom overrides unless a concrete upstream defect is isolated and documented.
- **[AVOID][Recommendation]** Route × theme × state × engine Cartesian test multiplication; use one representative gallery matrix plus targeted route/behavior tests.
- **[AVOID][Ryan]** Do not use raw class count, LOC, package bytes, or runtime milliseconds as the design score.
- **[SHOULD/default][Recommendation]** Investigate those measures only when they reveal ownership or maintenance problems.

## 13. Cross-project theming/adoption

**[Ryan]** Precedence is: **project identity and explicit brief > accessibility/native semantics > Neobrui principles > recipe examples**.

- **[MUST][Ryan]** Product identity MUST override reference-theme values, fonts, motifs, density, content semantics, and application behavior.
- **[MUST][Recommendation]** Neobrui MUST support this through semantic role variables, primitive-local hooks, composition gap/measure hooks, a scoped theme root, and ordinary later/unlayered product CSS.
- **[MUST][Recommendation]** Neobrui MUST NOT duplicate framework behavior, product theme state, Tailwind configuration, Astro scoping, routing, persistence, validation, or application JavaScript.
- **[SHOULD/default][Recommendation]** Adoption SHOULD begin with one visible, rollback-safe slice that transfers real ownership rather than stacking dormant classes.
- **[MUST][Recommendation]** The adopter MUST record which declarations Neobrui owns, which remain product-owned, and which bridge values are required.
- **[SHOULD/default][Recommendation]** Expansion SHOULD require a second independent adopter and a successful removal/rollback exercise.
- **[MAY/option][Recommendation]** A product MAY use only Foundations, only one Composition, or only one Primitive.
- **[AVOID][Recommendation]** Do not force the aggregate stylesheet, house theme, or compatibility aliases into a consumer.

## 14. Documentation information architecture

- **[MUST][Ryan]** Starlight MUST remain the maintained shell for navigation, sidebar, search, responsive behavior, and content routing.
- **[SHOULD/default][Recommendation]** Documentation SHOULD use seven use-oriented pages:
  1. **Start / Playground** — opt-in install, scope, live editable theme, and removal demo.
  2. **Principles** — hierarchy, intentional irregularity, restraint, good/bad comparisons.
  3. **Foundations / Theming** — token roles, product mapping, contrast, forced-colors and RTL.
  4. **Layout / Utilities** — Stack, Cluster, Wrapper, Grid, visually hidden, boundaries.
  5. **Primitives** — Surface, Pressable, conditional Field, states and ownership.
  6. **Patterns** — cards, alerts, badges, nav/toolbars, editorial, hero, mixed-span gallery.
  7. **Adoption / AI** — cross-project precedence, opt-out, migration, skill/agent contract.
- **[MUST][Recommendation]** Every rule MUST have a rendered good/bad example where visual or interaction evidence is useful.
- **[MUST][Ryan]** The gallery MUST demonstrate asymmetric hierarchy and mixed spans; it MUST NOT be a wall of identical Starlight cards.
- **[SHOULD/default][Recommendation]** Good/bad examples SHOULD share the same content so reviewers compare decisions rather than copywriting.
- **[SHOULD/default][Recommendation]** One representative gallery SHOULD receive full Chromium/Firefox/WebKit, light/dark, narrow/wide, keyboard, axe, RTL, forced-colors, and reduced-motion coverage; other pages SHOULD receive build/link/semantic smoke plus targeted behavior checks.
- **[AVOID][Recommendation]** Do not rewrite built HTML, fork maintained Starlight components, or multiply every route by every visual mode and engine.

**[Repository evidence]** The current docs use a maintained Starlight shell but include a build-time HTML rewrite and a Search override for specific defects.[R4]  
**[SHOULD/default][Recommendation]** The simplification branch SHOULD first verify whether current upstream behavior makes either workaround unnecessary before retaining it.

## 15. AI ingestion contract

- **[SHOULD/default][Recommendation]** The future canonical agent artifact SHOULD live at `skills/neobrui/SKILL.md` with `references/tokens-and-classes.md`, `references/examples-and-anti-examples.md`, and `templates/verification-checklist.md`.
- **[MUST][Recommendation]** The repo skill MUST be source-controlled but MUST NOT be installed automatically into a Hermes/user profile.
- **[MAY/option][Recommendation]** A tool-specific `AGENTS.md`, `CLAUDE.md`, or similar file MAY point to the canonical skill.
- **[MUST][Recommendation]** A pointer file MUST NOT duplicate the canonical skill’s rules.
- **[MUST][Recommendation]** The skill trigger MUST state: “Use when an explicit brief asks for Neobrui or Ryan’s Neobrutalist design language; do not apply by default.”
- **[MUST][Recommendation]** The skill MUST include scope/opt-out, precedence, stepwise procedure, class/token lookup, good/bad examples, accessibility checklist, and verification.
- **[MUST][Recommendation]** The agent MUST preserve existing project identity, semantics, behavior, and declared browser matrix before adding visual treatment.
- **[MUST][Recommendation]** The agent MUST identify hierarchy and focal surfaces before selecting classes.
- **[MUST][Recommendation]** The agent MUST run a restraint pass that removes treatments which carry no information.
- **[MUST][Recommendation]** The agent MUST verify responsive order, keyboard/focus, contrast, forced colors, reduced motion, and relevant engines before claiming success.
- **[AVOID][Recommendation]** The agent must not infer Neobrui adoption from the dependency’s presence or from a prior Neobrutalist project.

**[Recommendation]** The following compact future skill outline is a specification example only; its procedural lines inherit the surrounding recommendation and do not create an installed skill:

```markdown
---
name: neobrui
description: Apply Neobrui only when a project explicitly opts in.
version: 0.1.0
---
# Neobrui
## When to use / do not use
## Precedence and product-identity boundary
## Procedure
1. Read the brief, product tokens, semantic markup, and responsive/task order.
2. Identify heading, primary task/action, focal surfaces, and quiet regions.
3. Map project roles to Neobrui tokens inside an explicit scope.
4. Choose Compositions, then the smallest Primitive/Utility set.
5. Apply intentional irregularity from content hierarchy.
6. Run restraint and identity-removal passes.
7. Verify semantics, keyboard, contrast, 320px, 200%, RTL, forced colors,
   reduced motion, and the declared browser matrix.
## Token/class lookup
## Good and bad examples
## Accessibility and verification checklist
## Pitfalls and opt-out
```

## 16. Acceptance/evaluation rubric

**[MUST][Recommendation]** Score each dimension as **0 = fails/unknown, 1 = partial/inconsistent, 2 = clear and evidenced**.  
**[MUST][Recommendation]** A project MUST score **15/18 or higher**, with no zero in semantic/accessibility quality, responsive robustness, or interaction consistency, to pass.  
**[AVOID][Ryan]** Do not score raw class count, LOC, package bytes, or performance.  
**[MAY/option][Recommendation]** Reviewers MAY note those measures as secondary maintenance signals.

**[Recommendation]** The rubric table defines the proposed evidence interpretation for each dimension.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Intentional hierarchy/asymmetry | Equal or random loudness | Some hierarchy but repeated equal-card defaults | Content importance clearly drives span, rhythm, alignment, and quiet space |
| Visual signature fidelity | Generic UI or decorative mimicry | Some signature elements without coherent grammar | Bold hierarchy, bounded color, thick boundaries, hard shadows, tactile depth used coherently |
| Restraint | Everything decorated | Some quiet regions but competing focal points | Treatments concentrate attention and at least 30–50% of regions remain quiet |
| Semantic/accessibility quality | Semantic/state failures or unknown | Mostly native with gaps | Native semantics, labels, keyboard, contrast, focus and manual/automated evidence are clear |
| Product identity preservation | Looks like the reference theme | Identity partly retained | Palette, type, motifs, content and behavior unmistakably belong to the product |
| Responsive robustness | Overflow/order/function loss | Works at common widths with weak fallbacks | 320px/200%/long content/task order and asymmetry fallback are evidenced |
| Interaction consistency | Ambiguous or mismatched states | Core states exist with inconsistencies | Hover/active/focus/disabled/invalid/busy and shadow/press direction follow one model |
| Ownership clarity | Package/product responsibilities overlap | Most ownership documented | Every token, class, behavior and bridge has one owner and rollback path |
| AI reproducibility | Agents make incompatible choices | Checklist exists but examples diverge | Two agents/projects independently reach the same grammar while retaining distinct identities |

- **[MUST][Recommendation]** Evaluation MUST compare at least two materially different product identities.
- **[MUST][Recommendation]** Reviewers MUST inspect rendered hierarchy and source/semantic behavior; screenshots alone are insufficient.
- **[MUST][Recommendation]** A project with a semantic/accessibility, responsive, or interaction zero MUST fail regardless of total score.
- **[SHOULD/default][Recommendation]** Maintenance signals SHOULD trigger investigation only when they reveal duplication, unclear ownership, brittle setup, or unsustainable verification.

## Proposed next production plan

- **[MUST][Ryan]** Use one simplification feature branch only; do not create an implementation graph yet.
- **[MUST][Recommendation]** Step 1: record the six pending decisions in one branch-local ADR.
- **[MUST][Recommendation]** Step 2: simplify the package to directly authored foundations, four Compositions, visually hidden, Surface/Pressable, and conditional Field; preserve native/forced-color/RTL/reduced-motion outcomes while deleting obsolete mechanisms rather than compatibility-wrapping them.
- **[MUST][Recommendation]** Step 3: reorganize Starlight into the seven pages above, remove post-build rewriting and unnecessary component overrides, and build an asymmetric pattern gallery with paired good/bad examples.
- **[MUST][Recommendation]** Step 4: add the future repo-owned skill only after the human-facing charter/API is stable, and do not profile-install it.
- **[MAY/option][Recommendation]** The simplification branch MAY include the reviewed skill draft.
- **[MUST][Recommendation]** Step 5: verify package opt-in/removal, one representative multi-engine gallery, targeted primitive states, build/link smoke, package pack/install, and one real consumer pilot.
- **[MUST][Recommendation]** Step 6: request an independent reviewer who did not implement the branch to score both the neutral gallery and one product mapping with this rubric.
- **[MUST][Recommendation]** Publication, npm release, adopter expansion, and a broader task graph MUST remain separate decisions after independent review.

## Repository evidence

- **[R1]** `/workspace/neobrui/docs/current-surface.md`, retrieved 2026-08-27 at repository commit `78a44b483c4828174ded5187221c7500e662d478`: reset-free CSS-only current surface, native ownership, `nbr` classes, themes and current integrations.
- **[R2]** `/workspace/neobrui/decisions/ADR-010-cube-migration-contract.md`, retrieved 2026-08-27 at the same commit: accepted private-alpha naming, layer, composition, utility, theme, shadow, and package boundaries; treated here as evidence, not the desired final architecture.
- **[R3]** `/workspace/htmlday-lite/evidence/neobrui-utility-pilot.md`, branch `spike/neobrui-utility-first`, commit `28f2a016ee696a444176812c2960138fe5b5521f`, retrieved 2026-08-27: corrected INVALIDATED verdict, +25 utility tokens, +14 product CSS lines, bridge/cascade/setup costs, interaction-value drift, and the exercised matrix result of 77 passed, 7 skipped, plus one flaky mobile-Chrome gutter failure that passed only in isolation.
- **[R4]** `/workspace/neobrui/apps/docs/astro.config.mjs`, `/workspace/neobrui/apps/docs/README.md`, and current docs MDX, retrieved 2026-08-27 at commit `78a44b4`: maintained Starlight shell plus current build-time rewrite, Search override, route structure, and equal-card examples.
- **[R5]** `/workspace/dev-vault/Research/Neobrutalist Web Design/Neobrutalist Web Design - History, Practices, Quirks, and Pitfalls.md` and `Component Library/Neobrutalist Component Library Research.md`, retrieved 2026-08-27: previously cited history, accessibility, restraint, project and market synthesis.

## Sources

[1] https://www.architectural-review.com/essays/reborn/the-new-brutalism-by-reyner-banham  
[2] https://brutalistwebsites.com  
[3] https://www.nngroup.com/articles/brutalism-antidesign  
[4] https://www.smashingmagazine.com/2020/01/split-personality-brutalist-web-development  
[5] https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html  
[6] https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html  
[7] https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html  
[8] https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html  
[9] https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html  
[10] https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html  
[11] https://www.w3.org/WAI/WCAG22/Understanding/reflow.html  
[12] https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html  
[13] https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html  
[14] https://www.w3.org/WAI/ARIA/apg/patterns  
[15] https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors  
[16] https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion  
[17] https://cube.fyi/composition  
[18] https://cube.fyi/utility
