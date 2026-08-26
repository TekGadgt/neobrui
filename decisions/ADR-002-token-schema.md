# ADR-002: Semantic token schema and generated CSS

Status: accepted for disposable Spike 1.

A finite, framework-neutral source in `src/tokens/tokens.mjs` owns semantic role families. `scripts/build-tokens.mjs` validates every required role and emits deterministic CSS custom properties with the temporary `_nb-spike` prefix. CSS is the only runtime artifact; there is no runtime JavaScript, raw-color prop API, bundled font, or public package contract.

The three fixture-local themes intentionally choose different values while sharing role relationships. Application-owned palette names, content, typography choices, motifs, and behavior remain outside core. A nested theme demonstrates subtree remapping without sibling leakage. Missing or blank roles produce human-readable errors before CSS generation.
