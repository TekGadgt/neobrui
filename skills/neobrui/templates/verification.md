# Neobrui verification template

## Static and package

- [ ] CSS/API contract extracts every public class, attribute, custom property, and package export.
- [ ] Every extracted item appears in the relevant human page and `references/api.md`.
- [ ] No reset, bare-element selector, `!important`, runtime JS, or unreviewed dependency.
- [ ] `npm pack --dry-run` is allowlisted and package smoke imports aggregate and subpaths.

## Documentation

- [ ] All seven routes build at root and `/neobrui/` Pages base.
- [ ] Internal links, anchors, headings, code examples, and generated search/sitemap/404 boundaries pass.
- [ ] Tables and code blocks do not create horizontal overflow at 320px.

## Browser and manual

- [ ] Representative Playwright projects pass Chromium, Firefox, and WebKit.
- [ ] Keyboard focus and native semantics reviewed; axe is supplemental, not a conformance claim.
- [ ] 320px, wide, light/dark, RTL, forced colors, and reduced motion reviewed.
- [ ] Removing imports/classes leaves semantic HTML and application behavior.
