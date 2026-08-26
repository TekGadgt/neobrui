# Manual accessibility test run

Copy this file to a project-relative evidence/run-log location for each run. Do not record personal data. This log records one environment/run; use a separate copy for each browser, assistive technology, device, direction, or zoom mode as needed.

## Run identity

- Run ID:
- Date/time (timezone):
- Tester initials or team alias (optional; no personal contact details):
- Fixture/project-relative path or URL:
- Block/fixture scope: [ ] Surface Block  [ ] Button Block  [ ] Field Block  [ ] integration fixture  [ ] future Block: ______
- Commit/package version:
- Human test or automated supplement: [ ] human  [ ] automated supplement (describe):
- Overall status: [ ] passed  [ ] failed  [ ] blocked  [ ] not run

## Environment

- OS/version:
- Browser/version (run separately per browser):
- Assistive technology/version/settings:
- Device/model (if physical):
- Viewport CSS pixels:
- Browser UI zoom: ____% (must be 200% for zoom run)
- Pinch zoom used: [ ] no  [ ] yes (touch-only; do not substitute for UI zoom)
- Windows Contrast Theme: [ ] off  [ ] real theme on (name): ______  [ ] Playwright emulation only
- Direction: [ ] ltr  [ ] rtl  [ ] nested direction fixture
- Reduced motion: [ ] default  [ ] prefers-reduced-motion enabled
- Keyboard: [ ] physical keyboard  [ ] automation only
- Touch: [ ] physical touch  [ ] emulation only

## Preconditions and evidence

- Relevant setup/enable steps completed:
- Evidence directory (project-relative):
- Screenshot/video/log names (redacted):
- Version/source notes:
- Limitations or unavailable equipment:

## Checklist and results

Mark each item `[x]` only after the described human check passes. Put failures in the defect table below.

### Contrast themes / forced colors (repeat Chrome, Firefox, Edge)

- [ ] Real Windows Contrast Theme enabled and disabled afterward; OS/browser versions recorded.
- [ ] Surface quiet/outlined/raised retains readable text, borders, separation, and diagonal/hard-shadow intent.
- [ ] Button native button and button-like link retain name, distinction, focus, and activation cues.
- [ ] Field label, description, required, invalid/error, and disabled states remain perceivable.
- [ ] Focus remains visible; links are not distinguished by color alone.
- [ ] 320 CSS px/narrow reflow has no clipped labels/errors or unjustified scroll.
- [ ] RTL and nested direction checked where supported.
- [ ] Emulation, if used, is labeled supplementary rather than OS evidence.

### NVDA (run separately with Firefox and Chrome)

- [ ] Official NV Access install/source used; NVDA, Windows, and browser versions recorded.
- [ ] Headings and content order are meaningful.
- [ ] Keyboard focus reaches intended controls with no trap or unexpected jump.
- [ ] Button has useful name, button role, and disabled/busy state when applicable.
- [ ] Link has useful name, link role, and navigation behavior.
- [ ] Field conveys label/name, type, description, required, invalid, and error information as applicable.
- [ ] Disabled controls are announced/inoperable as appropriate.
- [ ] Browse/focus mode behavior is usable; exact punctuation/speech wording was not over-prescribed.
- [ ] RTL/nested direction checked where supported.

### VoiceOver + Safari (macOS)

- [ ] Official Apple enable/disable guidance followed; macOS, Safari, and VoiceOver details recorded.
- [ ] Headings/content order and VoiceOver/keyboard/visual focus are coherent.
- [ ] Button name/role and disabled state are available.
- [ ] Link role and navigation behavior are available.
- [ ] Field label/name, type, description, required, invalid, and error information are available.
- [ ] RTL/nested direction checked where supported.

### Physical keyboard

- [ ] Tab and Shift+Tab order is predictable and matches meaningful content order.
- [ ] Focus is always visible and not hidden by sticky UI.
- [ ] Enter/Space activate native buttons correctly; Enter activates links.
- [ ] Disabled controls do not activate; `aria-disabled` application behavior was checked.
- [ ] Forms, invalid submission, correction, and error/focus behavior work.
- [ ] No keyboard trap or unexpected focus jump, including nested/RTL areas.
- [ ] Reduced-motion setting does not obscure focus or cause layout shift.
- [ ] Physical hardware check is distinguished from automation.

### Physical touch (when devices available)

- [ ] Current iOS Safari device and/or Android Chrome device recorded.
- [ ] Minimal pilot device matrix only; optional expansion justified: ______
- [ ] Targets have adequate separation; no accidental adjacent activation.
- [ ] Button/link/field and disabled/invalid/required states work by touch.
- [ ] Pressed feedback does not move layout or target geometry.
- [ ] Portrait and landscape checked; device equivalent of 320 CSS px checked.
- [ ] Pinch zoom/pan preserve access to content and focused controls.
- [ ] On-screen keyboard leaves fields visible; input type, correction, validation, and submission work.

### Desktop browser UI zoom at 200%

- [ ] Chrome checked with displayed browser UI zoom at 200%.
- [ ] Firefox checked with displayed browser UI zoom at 200%.
- [ ] Safari checked with displayed browser UI zoom at 200% (macOS).
- [ ] Edge checked with displayed browser UI zoom at 200%.
- [ ] This was browser UI zoom, not root font-size substitution or pinch zoom.
- [ ] Text reflows; ordinary content, labels, errors, and controls do not clip/truncate.
- [ ] Horizontal scrolling exists only for genuinely two-dimensional content.
- [ ] Focus, contrast, borders, links, forms, RTL/nested areas remain usable.

## Defects and retest

| ID | Severity | Environment/state | Expected result | Actual result | Evidence filename | Fix/defect reference | Retest status/date | Waiver rationale/expiry |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

Severity guidance: `blocker` prevents the flow or creates a serious barrier; `high` removes a core name, role, state, focus path, or essential content; `moderate` materially impairs a documented state or viewport; `low` is a minor clarity/consistency issue. A waiver is not a pass and must include affected users, risk, owner, expiry/review date, and reason.

## Support decision

- Environments that passed (named versions and dates):
- Environments failed/blocked/not run:
- Automated complementary evidence (axe/DOM/computed/screenshot/Playwright):
- [ ] No relevant failure or unrun environment is being described as supported.
- Approved bounded wording:
- Release/support stop condition or waiver decision:
- Follow-up owner and next cadence:
