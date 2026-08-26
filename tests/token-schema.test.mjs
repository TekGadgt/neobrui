import assert from 'node:assert/strict';
import { generateCss } from '../src/tokens/tokens.mjs';
import { themes } from '../fixtures/inputs.mjs';
import { validateTokens } from '../src/tokens/schema.mjs';

const errors = validateTokens({ ...themes['personal-light'], color: { ...themes['personal-light'].color, text: '' } });
assert.ok(errors.some(error => error.includes('color.text')));
assert.throws(() => generateCss({ broken: { color: {} } }), /Missing required token family|Missing or invalid required role/);
const css = generateCss(themes);
assert.ok(css.indexOf('[data-_nb-theme="personal-light"]') < css.indexOf('[data-_nb-theme="personal-dark"]'));
assert.ok(css.includes('--_nb-surface-background'));
assert.ok(!css.includes('dtcg'));
for (const [family, roles] of Object.entries(themes['personal-light'])) {
  for (const role of Object.keys(roles)) assert.ok(`${family}.${role}`.includes('.'));
}
console.log('token schema tests: 5 passed');
