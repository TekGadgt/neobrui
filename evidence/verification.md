# Generation and validation evidence

- Focused RED: `pnpm exec playwright test tests/multi-page.spec.js --project=chromium` failed before the build fix: isolated URLs received the plain page title/theme and `dist/<route>/index.html` did not exist.
- Focused GREEN: `CI=true pnpm exec playwright test tests/multi-page.spec.js` -> 18 passed (Chromium 6, Firefox 6, WebKit 6).
- Frozen install: `CI=true pnpm install --frozen-lockfile` -> passed.
- Token validation: `CI=true pnpm validate:tokens` -> `token schema tests: 5 passed`.
- Remediation: `node tests/remediation.test.mjs` -> `remediation tests: 31 files, 14 families`.
- Build: `CI=true pnpm build` -> Vite production build passed with `dist/index.html`, `dist/personal-light/index.html`, `dist/personal-dark/index.html`, `dist/workshop/index.html`, `dist/nested-theme/index.html`, and `dist/neutralized/index.html`; generated local assets are under `dist/assets/`.
- Full browser matrix: `CI=true pnpm test` -> 33 passed total (Chromium 11, Firefox 11, WebKit 11).
- Determinism: generated CSS SHA-256 `0447749788457cc5934e5f2e8ca14fcaeb324be160c3ada59d0ff3b41e9a6df5`, size 8111 bytes; repeated generation comparison passed.
- Boundary check: `git diff --check` -> passed; final tree clean after local commit.

Generated CSS is deterministic, role-ordered, and contains no DTCG JSON. DTCG export is deferred because no named consumer or authorized importer/exporter exists. Automated checks are evidence, not a substitute for manual keyboard, assistive technology, touch, screenshot, and forced-colors review.
