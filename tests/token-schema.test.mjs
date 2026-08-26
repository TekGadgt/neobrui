import assert from 'node:assert/strict';
import { generateCss } from '../src/tokens/tokens.mjs';
import { themes } from '../fixtures/inputs.mjs';
import { validateTokens } from '../src/tokens/schema.mjs';

const errors = validateTokens({ ...themes['personal-light'], color: { ...themes['personal-light'].color, text: '' } });
assert.ok(errors.some(error => error.includes('color.text')));
assert.throws(() => generateCss({ broken: { color: {} } }), /Missing required token family|Missing or invalid required role/);
const validShadowLengths = ['0', '-0', '3px', '-2.5rem', '.25em', '1ch', '2ex', '3vw', '4vh', '5vmin', '6vmax'];
for (const length of validShadowLengths) {
  const errorsForLength = validateTokens({ ...themes['personal-light'], shadow: { inline: length, block: length, pressInline: length, pressBlock: length } });
  assert.ok(errorsForLength.every(error => !error.includes('shadow.')), `expected supported shadow length: ${length}`);
}
for (const role of ['inline', 'block', 'pressInline', 'pressBlock']) {
  const percentageTheme = { ...themes['personal-light'], shadow: { ...themes['personal-light'].shadow, [role]: '3%' } };
  assert.ok(validateTokens(percentageTheme).some(error => error === `Invalid shadow axis length "shadow.${role}"`));
}
for (const invalidLength of ['3%','3px 0 0 red','#000','NaN','Infinity','calc(1px + 2px)','var(--offset)','3in']) {
  const errorsForLength = validateTokens({ ...themes['personal-light'], shadow: { ...themes['personal-light'].shadow, inline: invalidLength } });
  assert.ok(errorsForLength.some(error => error === 'Invalid shadow axis length "shadow.inline"'), `expected rejected shadow length: ${invalidLength}`);
}
const css = generateCss(themes);
assert.ok(css.indexOf('[data-theme="personal-light"]') < css.indexOf('[data-theme="personal-dark"]'));
assert.ok(css.includes('--nbr-surface-background'));
assert.ok(!css.includes('dtcg'));
for (const [family, roles] of Object.entries(themes['personal-light'])) {
  for (const role of Object.keys(roles)) assert.ok(`${family}.${role}`.includes('.'));
}
console.log('token schema tests: 5 passed');
