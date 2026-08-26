# Personal project theme template

Copy `fixtures/theme-template.mjs` into a product project and replace the selectors with selectors owned by that product. Neobrui does not provide a theme toggle, persistence, `data-nbr-theme`, or runtime state machine.

```js
import { themes } from './tokens.mjs';
import { generateDtcgBundle } from 'neobrui/tokens.dtcg';

export const selectors = {
  light: '.my-site[data-theme="light"]',
  dark: '.my-site[data-theme="dark"]',
};

export const dtcg = generateDtcgBundle(themes, { selectors });
```

The editable authority is the validated JS/TS map. Generated CSS and DTCG JSON are build artifacts, UTF-8/LF with deterministic ordering, and must not be hand-edited. DTCG 2025.10 is limited to groups, `$value`, `$type`, aliases using `{group.role}`, and the documented `org.neobrui` provenance extension. Unknown properties/extensions fail import.

`generateDtcg` accepts exactly one theme. Multi-theme input to that API is rejected as ambiguous; use the named `generateDtcgBundle` API, which returns every per-theme artifact plus a separate manifest without discarding values. Generated per-theme files are under `generated/tokens/<theme>.css` and `generated/dtcg/<theme>.json`; `generated/dtcg/manifest.json` is the product-selector sidecar. These files are build-time interchange only: runtime CSS does not fetch or load JSON, JavaScript, fonts, or images.
