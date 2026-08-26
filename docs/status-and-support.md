# Status and support

## Current posture

Neobrui is a validated personal-use pilot for Ryan's personal projects. It is private, local-only, CSS-only, and unpublishable in its current form. There is no public API, stable namespace, npm availability, SLA, issue response promise, or framework/support commitment.

What is validated: semantic tokens; opt-in Surface, Button, and Field CSS; RTL/nested/fixed shadow behavior; cascade layers; plain CSS/CSS Modules/Astro/Tailwind coexistence fixtures; zero runtime JavaScript in the candidate; deterministic size/archive checks; and automated Chromium, Firefox, and WebKit fixture coverage.

The size result is honest and provisional: overall `warning/narrow`; standalone Button is 2,413 minified bytes against a provisional 1,800-byte ceiling, while its gzip result remains below the warning/kill limits. This is not a CSS/API change or a publication signal.

## Coverage boundary

Automation is complementary, not manual accessibility evidence. The QA checklist records `passed`, `failed`, `manual-unavailable`, `not-triggered`, and `not-run`; the current manual AT, OS forced-colors, physical keyboard/touch, and true browser-UI zoom procedures have no dated execution record and therefore remain unexecuted. Do not claim support for NVDA, VoiceOver, Windows Contrast Themes, devices, or 200% browser UI zoom until a relevant run record exists.

The procedure and copyable template are:

- `docs/manual-accessibility-testing.md`
- `docs/templates/accessibility-test-run.md`

Cadence is affected behavior changes, personal-project adoption, release-candidate review, and any future public-support gate. Start with the neutral fixture and one bounded adopter. A dated run log is evidence; the procedure alone is not.

## Before GitHub push (future gate; do not push now)

- [ ] Scan current files and all history for secrets, private links, personal data, and container/host-only paths.
- [ ] Ryan chooses and adds a license; do not infer one from public visibility.
- [ ] Review README wording, contribution expectations, support boundaries, and no framework-completeness claim.
- [ ] Choose issue triage, security reporting, contact, and response policy.
- [ ] Record provenance for generated CSS, fixtures, evidence, archives, and reports; exclude accidental generated artifacts.
- [ ] Configure and observe CI for frozen install, token build, archive/consumer, size, seeded QA, and Chromium/Firefox/WebKit.
- [ ] Review versioning, release, deprecation, rollback, and package provenance policy.
- [ ] Check package metadata/exports and confirm no accidental registry publication or credentials.
- [ ] Re-run links, path checks, and a clean-tree check immediately before any authorized push.

Until these gates and Ryan's public-source decision are complete, use “personal-use pilot” or “untested,” not broad support language.
