# Generation and validation evidence

- Focused RED: `node tests/remediation.test.mjs` failed before remediation because unknown families/roles were accepted and required isolated fixture files were absent.
- Focused GREEN: `CI=true pnpm validate:tokens` -> `token schema tests: 5 passed`.
- Remediation regression: `node tests/remediation.test.mjs` -> `remediation tests: 30 files, 14 families`.
- Generator: `CI=true pnpm build:tokens` -> generated `fixtures/plain/generated-tokens.css` for five fixture-owned inputs.
- Build: `CI=true pnpm build` -> Vite production build passed.
- Full browser matrix: `CI=true pnpm test` -> 15 passed total (Chromium 5, Firefox 5, WebKit 5).

Generated CSS is deterministic, role-ordered, and contains no DTCG JSON. DTCG export is deferred because no named consumer or authorized importer/exporter exists. Automated checks are evidence, not a substitute for manual keyboard, assistive technology, touch, screenshot, and forced-colors review.
