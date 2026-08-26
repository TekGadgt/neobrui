import assert from 'node:assert/strict';
import { generateCss, normalizeTokenPath } from '../src/tokens/tokens.mjs';
import { themes } from '../fixtures/inputs.mjs';

const css = generateCss({ light: themes['personal-light'] });
assert.match(css, /@layer nbr\.tokens, nbr\.compositions, nbr\.utilities, nbr\.blocks, nbr\.exceptions;/);
assert.match(css, /--nbr-color-text-muted/);
assert.doesNotMatch(css, /--_nb-|data-_nb-/);

assert.equal(css.indexOf('@layer nbr.tokens'), 0);
assert.equal((css.match(/@layer nbr\.tokens, nbr\.compositions, nbr\.utilities, nbr\.blocks, nbr\.exceptions;/g) ?? []).length, 1);
assert.ok(css.indexOf('nbr.tokens') < css.indexOf('nbr.compositions'));
assert.ok(css.indexOf('nbr.compositions') < css.indexOf('nbr.utilities'));
assert.ok(css.indexOf('nbr.utilities') < css.indexOf('nbr.blocks'));
assert.ok(css.indexOf('nbr.blocks') < css.indexOf('nbr.exceptions'));

for (const [input, expected] of [
  ['color.textMuted', 'color-text-muted'],
  ['shadow\\pressInline', 'shadow-press-inline'],
  ['//control///padInline', 'control-pad-inline'],
  ['./surfaceRaised', 'surface-raised'],
]) assert.equal(normalizeTokenPath(input), expected, input);
for (const input of ['../outside', 'tokens/../color', 'color/../../text']) {
  assert.throws(() => normalizeTokenPath(input), /Traversal/);
}

console.log('cube contract tests: passed');
