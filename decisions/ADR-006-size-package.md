# ADR-006: Private CSS package size candidate

Status: accepted for Spike 5 only

## Decision

Measure a private candidate containing the three recipe entries (Surface, Button, Field), their aggregate, and one optional neutral/reference token entry. The recipe core requires consumer-defined semantic tokens; the five generated fixture themes remain fixture-only and are explicitly excluded. The archive is `private: true`, has explicit CSS-only subpath exports, and is never published.

The size harness uses deterministic in-repo comment/whitespace normalization and the system `gzip -9 -n -c` command; reports record its version provenance. The committed report is initial design evidence, not a required freshness artifact. Each artifact records raw, minified, gzip, SHA-256, comment/map policy, thresholds, and verdict. The combined consumer candidate is measured separately from archive bytes. Consumer accounting is taken from the CSS emitted by the root harness's pinned Vite 7.3.6 test tooling after installing the local `.tgz` into a fresh consumer outside the workspace with an offline, frozen pnpm lockfile. The consumer application graph contains only that archive; Vite remains root-harness tooling. Raw emitted bytes are the observed identity-transfer bytes, while gzip is diagnostic only.

Report provenance is intentionally non-recursive: `input.sourceManifest` and its SHA-256 identify measured source inputs (excluding `size-report.json`), and `input.workspaceState` records clean/dirty state at measurement time. `measure:size` intentionally generates the report. `verify:size` remains a fresh, non-mutating size-evidence command, but it is not coupled to Playwright preview startup and is not required for every browser run or CI build: observed host tool-version strings are audit provenance, while measured bytes, hashes, budgets, verdicts, source manifests, archive contents, consumer outputs, formula, and pnpm contract remain strict. Repeated-build determinism for CSS, archive, consumer metadata, and hashes is asserted by `tests/size-package.test.mjs`; release and browser verification retain the deterministic package, checksum, zero-runtime, and export checks.

## Budget response

The provisional product hypotheses are: foundations <=6,000/3,500/1,500 bytes raw/min/gzip; each recipe <=3,000/1,800/800; aggregate <=14,000/8,000/3,000, warning through 5,000 and kill above 5,000 gzip; runtime JavaScript exactly zero. This run records measured results in `size-report.json`. The aggregate is within the success budget; standalone Button and Field exceed the provisional minified-byte ceiling while remaining below gzip warning/kill limits, so the honest overall verdict is `warning/narrow`. This is a measurement warning for a future minifier/recipe reduction pass, not a kill; any gzip kill requires redesign before proceeding.

## Consequences

The archive and isolated consumer provide evidence of package boundaries and zero-JS behavior, not a public API, semver, npm reservation, framework adapter, or deployment promise. Fixture tooling may use JavaScript outside the candidate, but candidate contents may not contain JavaScript or runtime assets.
