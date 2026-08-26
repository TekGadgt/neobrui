# Spike 1 token mapping report

One semantic schema is rendered by three isolated fixture relationships: `personal-light`, `personal-dark`, and `workshop`. Each maps canvas/surface, text, boundary, intent, geometry, space, type, motion/focus, and recipe-hook roles independently; no role name encodes a palette, product, or application area.

The two personal relationships remap canvas, surfaces, text, action, focus, and shadow while preserving the same semantic HTML. The workshop relationship uses distinct local values and keeps its workshop palette meanings fixture-local. The nested dark subtree remaps the same roles locally; sibling theme scopes are unaffected.

Identity removal comparison: replacing all fixture-local palette values with neutral paper/ink values and system fonts preserves heading/body scale, quiet-versus-raised surface hierarchy, native required/invalid state, disabled affordance, action text, and focus outline. No motif or bundled font is required to understand state.

Stop-condition assessment: no per-instance raw color props, no more than four application overrides per recipe, and no project-named core roles were needed. Continue the bounded spike; do not infer package/public API readiness.
