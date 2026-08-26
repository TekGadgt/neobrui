# Generation and validation evidence

- Focused RED: before implementation, `node tests/token-schema.test.mjs` was expected to fail because the schema/generator modules did not exist.
- Focused GREEN: `pnpm validate:tokens` -> `token schema tests: 4 passed`.
- Generator: `pnpm build:tokens` -> generated `fixtures/plain/generated-tokens.css`.
- Build: `pnpm build` -> Vite production build passed.
- Full browser matrix: `pnpm test` runs Chromium, Firefox, and WebKit; record final per-engine counts in the task handoff.

Generated CSS is deterministic, role-ordered, and contains no DTCG JSON. DTCG export is deferred because no named consumer or authorized importer/exporter exists.
