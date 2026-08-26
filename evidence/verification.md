# Generation and validation evidence

- Focused RED (before remediation): `CI=true pnpm exec playwright test tests/multi-page.spec.js --project=chromium --grep 'invalid email state contract'` -> 6 failed (root plus five isolated routes), each missing `aria-invalid`; the intentionally invalid state previously had only a color-changing `input:invalid` border.
- Focused GREEN: the same Chromium assertion command after remediation -> 6 passed. The root checks both intentionally displayed email fields; each isolated route checks its one field.
- Frozen install: `CI=true pnpm install --frozen-lockfile` -> passed.
- Token validation: `CI=true pnpm validate:tokens` -> `token schema tests: 5 passed`.
- Remediation/boundary checks: `node tests/remediation.test.mjs` -> `remediation tests: 31 files, 14 families`; no cross-project/framework/DTCG-boundary violations.
- Production build: `CI=true pnpm build` -> passed; root plus five isolated HTML entries emitted, with two local CSS assets (`dist/assets/fixture-KeUdBIaL.css`, `dist/assets/generated-tokens-OIxtAlbz.css`).
- Determinism: repeated `CI=true pnpm build:tokens` and `cmp` -> passed; generated CSS SHA-256 `0447749788457cc5934e5f2e8ca14fcaeb324be160c3ada59d0ff3b41e9a6df5`, size 8111 bytes.
- Full browser matrix: `CI=true pnpm test` -> `51 passed` (Chromium 17, Firefox 17, WebKit 17). This includes 18 invalid-state route assertions across all three engines, plus the prior 33 route/accessibility/boundary checks.
- Invalid-state contract coverage: all six served routes expose `aria-invalid="true"`; each email field references existing visible correction text through `aria-describedby`; visible text says `Enter a valid email address.`; dashed borders and a text-side marker remain under author color/shadow removal and `forced-colors: active` preflight.
- Contrast: prior route contrast check remains passing (personal-dark Action text `6.52625:1`, recorded in the preceding verification); the remediation adds a generic text marker and system-color forced-colors rule without changing that action pair.
- Boundary check: `git diff --check` -> passed. Manual AT/device verification remains outstanding: keyboard-only hardware traversal, VoiceOver/TalkBack, physical touch, visual screenshot review, physical forced-colors verification, 320px/200% zoom, and reduced-motion review.
