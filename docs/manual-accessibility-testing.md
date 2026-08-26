# Neobrui manual accessibility testing

Status: personal-use pilot procedure. The procedures below are instructions, not evidence that a run has passed. Do not claim support for an assistive technology, operating system, browser, or device until its relevant run is recorded as passing.

## Current manual QA triggers

Start with `fixtures/neutral-site/` and record a dated run when Composition or Utility behavior changes. At minimum check nested Stack/Cluster instances, long unbroken content at 320px, LTR/RTL and supported vertical writing modes, keyboard focus and the non-focusable visually-hidden decision, forced-colors, reduced motion, native form semantics, and no-shadow affordances. Playwright/axe evidence complements but does not replace the manual procedure below.


Use this guide for the validated `Surface`, `Button`, and `Field` Blocks and for representative integration fixtures that use them. Start with the neutral fixture and one bounded adopter. Preserve application-owned semantics and behavior: CSS does not create button/link roles, disable links, announce status, submit forms, or manage errors. Extend the same checks to a future Block only after its markup/state contract is written down; add a fixture and a run-log section rather than inferring coverage from a similar Block.

No user research or outreach is authorized by this guide. Record only test metadata and defect evidence; do not put names, emails, account data, or other personal data in screenshots, videos, logs, or tickets.

## Test boundaries and cadence

| Trigger | Minimum run |
|---|---|
| Personal-project adoption | Keyboard and 200% zoom on the fixture; one available AT/OS run and one available touch device; record unavailable environments as not run. |
| Affected behavior or Block state changes | Repeat every affected procedure, including the integration fixture and both directions where relevant. |
| Release candidate | Full manual matrix in this guide for the environments the pilot promises; unresolved failures block support wording. |
| Future public-support gate | Evidence-backed repeated runs on named stable versions, maintained device/AT matrix, owner and retest cadence, plus authorized user evidence and project governance. Until those exist, use “untested” or “personal-use pilot only,” never a broad support claim. |

The personal-use matrix is intentionally small: current stable Chrome, Firefox, and Edge on Windows for forced colors; NVDA with Firefox and Chrome; VoiceOver with Safari on one Mac; one physical keyboard; one iOS Safari device and one Android Chrome device when available; and desktop browser UI zoom at 200%. An optional expanded matrix (additional Windows browsers, Safari versions, screen readers, orientations, or older devices) is useful only when a project actually needs it.

## Run setup and evidence

Copy `docs/templates/accessibility-test-run.md` for each run. Record date/time and timezone, project-relative fixture/path, commit or package version, OS version, browser and version, AT/version, viewport/CSS-pixel size, zoom, direction (`ltr`/`rtl`), reduced-motion setting, and whether the check was human or automated. Evidence names should be project-relative, for example `evidence/manual-a11y/2026-08-26-nvda-firefox-field-error.png` and `.../notes.md`; redact personal data.

For each check record: precondition, exact steps, expected result, actual result, severity (`blocker`, `high`, `moderate`, `low`), evidence filename, defect reference, retest date/status, and waiver rationale. A failure is reproducible when the same fixture and state fail twice or another tester confirms it. Fix, rerun the original steps, attach passing evidence, and link the retest. A waiver must name the affected users, risk, owner, expiry/review date, and why the pilot remains acceptable; it is not a pass.

## A. Windows Contrast Themes / forced colors

### Prerequisites

Use a real Windows installation with a current stable Chrome, Firefox, and Edge (record exact versions). Save work, use a disposable fixture, and ensure screenshots contain no personal data. On Windows 11 open **Settings > Accessibility > Contrast themes**, choose a theme, select **Apply**; to restore choose **None** and **Apply**. On supported Windows 10 builds use **Settings > Ease of Access > High contrast**, turn on **Turn on high contrast**, choose a theme, and turn it off afterward. Use Microsoft’s current instructions linked below if labels differ.

Playwright `forced-colors` emulation is a useful repeatable complement, not proof of a Windows Contrast Theme run: it does not exercise the OS settings UI, native control rendering, or every browser/OS integration. Label emulated evidence `forced-colors-emulation`, never “Windows tested.”

### Procedure (repeat in Chrome, Firefox, and Edge)

1. Enable the real Contrast Theme and open the fixture at its normal desktop width. Check `Surface` quiet/outlined/raised, `Button` native button and link, and `Field` label, description, required, invalid/error, and disabled states.
2. Tab through every control and activate a button with Enter and Space; activate a link with Enter. Verify the focus indicator remains visible and distinct from the control boundary. Check borders, text, link distinction (not color alone), diagonal/hard-shadow treatment, and that removed shadows do not remove affordance or separation.
3. Submit or blur the invalid field. Verify the invalid indication, required indication, and error text remain perceivable and adjacent; confirm disabled controls are visibly disabled and cannot be activated. Check `aria-disabled` links separately: CSS appearance is not behavior.
4. Repeat with `dir="rtl"` and any nested direction fixture. At a 320 CSS-pixel viewport (or the narrowest available window), check wrapping, no clipped labels/errors, no accidental horizontal scroll except content that genuinely requires it, and usable focus.
5. Turn the theme off and repeat a quick normal-mode comparison. Record browser-specific differences rather than treating one browser as representative.

Expected: all information and focus/state distinctions remain available with system colors; text and borders do not disappear; controls remain operable; content reflows at 320px. Failures include invisible text/borders/focus, color-only error, shadow-only separation, clipped error text, or a button that looks enabled while disabled.

## B. NVDA on Windows

### Setup and prerequisites

Download NVDA only from the official NV Access site. Install or use the official portable option according to the installer’s prompts; do not use an untrusted mirror. Record NVDA, Windows, and browser versions, speech verbosity/profile, keyboard layout, and fixture commit. Use headphones if needed and avoid confidential audio capture. Start with normal speech; do not require a particular punctuation setting or exact speech string.

Run the complete procedure once with Firefox and separately with Chrome. Close other tabs, start NVDA, and use the default browse mode. `NVDA+Space` switches browse/focus mode where applicable; `Tab`, `Shift+Tab`, `Enter`, `Space`, `H`, and `K` are useful navigation keys. Do not treat a speech viewer transcript as a substitute for human listening, but it may be attached as supplementary evidence.

### Procedure

1. Move through headings with `H` and inspect content order. Tab through the fixture and compare visual order with reading/focus order. Confirm the browser and NVDA can reach every intended interactive element.
2. On `Button`, verify the accessible name and that it is announced as a button, including disabled/busy states. On a button-like link, verify it is announced as a link and activates/navigates as a link; do not accept a role mismatch hidden by styling.
3. On `Field`, verify the label/name, type, description, required state, and invalid state are conveyed. Trigger the error and listen for an understandable sequence containing the field identity, value/type, required/invalid state as applicable, and the error description. Exact punctuation and ordering of speech output may vary by verbosity/version; the information must be available without relying on visual proximity.
4. Check disabled controls are announced disabled and skipped or inoperable as appropriate. Confirm errors are not announced only once on page load and that focus does not jump unexpectedly. Repeat in RTL and nested-direction examples.
5. Use browse mode to read all content and focus mode to operate fields. Record missing names, wrong role (“link” instead of “button”), missing description/error, incorrect heading order, duplicate content, or focus loss.

Expected: every intended control has a useful name/role/state; labels and descriptions are programmatically associated; error and required information is available; content order is meaningful; disabled controls cannot be operated. Failure flow: save the browser/NVDA/version and state, capture a redacted speech-viewer excerpt or notes, reproduce twice, file the defect, fix, then repeat in both browsers and mark the retest.

## C. VoiceOver with Safari on macOS

### Setup

Use Apple’s current VoiceOver guidance: enable with **Command-F5** (on some keyboards use **Fn-Command-F5**) or **System Settings > Accessibility > VoiceOver**; disable with the same shortcut or switch. Record macOS, Safari, VoiceOver settings, fixture commit, viewport, and evidence. Start Safari in a clean window. `Control-Option` is the VoiceOver modifier (VO); use **VO-Right/Left**, **VO-Space**, and **VO-Command-H** for headings as applicable. Confirm the shortcut and current commands in Apple’s guide because keyboard settings vary.

### Procedure

1. Navigate the page with VO-Right/Left and headings. Verify content order and that the focused item is visually identifiable. Tab through controls and compare the VoiceOver cursor, keyboard focus, and visual focus.
2. On `Button`, verify its name, button role, and disabled state. On a link, verify link role and Enter/VO-Space navigation. On `Field`, verify label/name, type, description, required and invalid information.
3. Trigger an invalid field. Move away and back, and verify the error description is available without requiring sighted discovery. Check disabled controls cannot be activated. Test `dir="rtl"` and nested direction fixtures for sensible reading and focus order.
4. Capture notes or a redacted transcript of what was conveyed, plus a screenshot of the visual state where useful. Record differences from NVDA as observations, not as automatic failures.

Expected: meaningful order and focus, correct roles, names and states, associated descriptions/errors, and operable native controls. Retest the same Safari flow after fixes. This is a human VoiceOver check; browser DOM or automation alone cannot establish VoiceOver support.

## D. Physical keyboard

Use an actual keyboard, not only Playwright keyboard automation. Start with pointer hands off. At the page start, press `Tab` and then `Shift+Tab`; record every stop and compare it to the visual/content order. Check skip links if present. Verify focus is always visible, not clipped behind sticky UI, and has sufficient contrast.

Use Enter and Space on native buttons (including disabled), Enter on links, and keyboard interaction for every form control. Confirm links navigate, buttons perform only their action, disabled controls do nothing, and `aria-disabled` elements have application behavior that prevents activation. Hold or repeat Tab/Shift+Tab through dialogs, menus, RTL and nested-direction areas; there must be no trap, dead end, or unexpected jump. Test invalid submission, correction, and focus/error behavior. Enable reduced motion and confirm transitions do not obscure focus or cause layout shifts. Repeat at 320px and 200% browser zoom.

Expected: predictable order, visible focus, native activation semantics, no trap, usable forms, and stable reduced-motion behavior. Automation can verify event/DOM facts but cannot verify physical key feel, keyboard layout, focus visibility to a human, or a hardware trap.

## E. Physical touch/device testing

### Minimal pilot matrix

Use one iOS device with current iOS Safari and one Android device with current Android Chrome when available. Record model/OS/browser, orientation, viewport CSS pixels, text size/zoom settings, and whether an external keyboard was used. Do not imply coverage for other devices. Optional expansion is a second orientation and a project-relevant older/smaller device only when demand justifies maintenance.

### Procedure

1. In portrait and landscape, open the fixture and inspect `Surface`, `Button`, and `Field`. Confirm touch targets have enough separated tappable area, labels are reachable, and links/buttons cannot be accidentally activated by an adjacent target.
2. Tap buttons, links, fields, invalid/required/disabled states, and any nested RTL/direction example. Verify pressed feedback does not move content or change target geometry. A disabled control must not activate; a link must navigate as a link.
3. Pinch zoom and pan through the page. At the device’s equivalent of 320 CSS px, check reflow, clipping, error text, focus/active feedback, and horizontal scrolling exceptions. Rotate and repeat.
4. Focus a field and use the on-screen keyboard: verify input type, autocomplete/input purpose where provided, visibility while typing, scrolling above the keyboard, validation, correction, and submission. Check zoom/pan does not hide the focused field.

Expected: comfortable, separated targets; no accidental activation; stable feedback; usable orientation and zoom; form controls remain visible and operable with the keyboard. Device automation or desktop emulation is supplementary and does not prove physical touch, viewport chrome, keyboard, or one-handed use.

## F. True browser UI zoom at 200%

This check uses browser UI zoom, not a root `font-size` edit, CSS text-sizing substitution, or mobile pinch zoom. On desktop, set 200% using the browser menu or shortcuts: Chrome/Edge/Firefox `Ctrl`/`Command` + `+` until 200% (menu zoom displays the value); Safari **View > Zoom In** or its configured shortcut until the visible zoom is 200%. Record the displayed zoom and browser version; reset to 100% afterward.

At 200%, test the fixture at normal desktop width and then a narrow window. Tab through every control and trigger invalid/disabled/required states. Verify text reflows without clipping or overlap, labels and errors are readable, controls and focus remain visible, no essential content is truncated, and forms can be filled and submitted. Horizontal scrolling is acceptable only for content that genuinely needs two-dimensional presentation; it is a failure for ordinary text, labels, controls, or page layout. Check links, borders, contrast, focus, hard-shadow/diagonal behavior, and RTL/nested areas.

Expected: content remains available and operable at 200% with meaningful reflow, visible focus, and usable controls. Record browser-specific exceptions and screenshots. Browser zoom is distinct from pinch zoom and from automated root-text sizing; only the UI-zoom run supports this claim.

## Complementary automated checks and support language

Axe results, screenshots, computed styles, DOM assertions, and Playwright keyboard/forced-colors emulation are useful complementary evidence. They cannot replace a human using NVDA, VoiceOver, a physical keyboard, a physical touch device, real Windows Contrast Themes, or real browser UI zoom. Mark each manual environment `passed`, `failed`, `blocked`, or `not run`; never convert an automated pass into a manual support claim.

Stop a release/support claim when a blocker/high defect prevents operation, focus is invisible or trapped, names/roles/states are missing, an error cannot be understood, content is clipped/unavailable, or the relevant environment has not been run. Approved wording for unrun environments is “not manually tested” or “personal-use pilot; support not established.” Use “supports [named environment]” only after a passing run, with version and date, and keep the claim bounded by the recorded matrix.

## Primary references (accessed 2026-08-26)

- Microsoft high-contrast themes: https://learn.microsoft.com/en-us/windows/apps/design/accessibility/high-contrast-themes
- NV Access download and user guide: https://www.nvaccess.org/download/ and https://www.nvaccess.org/files/nvda/documentation/userGuide.html
- Apple VoiceOver User Guide: https://support.apple.com/guide/voiceover/welcome/mac
- Apple Safari User Guide: https://support.apple.com/guide/safari/welcome/mac
- WAI keyboard accessibility: https://www.w3.org/WAI/fundamentals/accessibility-principles/#operable
- WCAG 2.2 reflow (1.4.10): https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- WCAG 2.2 focus visible (2.4.7): https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- WCAG 2.2 target size (2.5.8): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Chrome zoom/help: https://support.google.com/chrome/answer/96810
- Firefox zoom/help: https://support.mozilla.org/en-US/kb/font-size-and-page-scale-firefox
- Microsoft Edge accessibility/help: https://learn.microsoft.com/en-us/microsoft-edge/accessibility
