import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const layout = await readFile(new URL('../src/layout.css', import.meta.url), 'utf8');
const primitives = await readFile(new URL('../src/primitives.css', import.meta.url), 'utf8');

test('wrapper owns a bounded border-box measure with logical gutters', () => {
  assert.match(layout, /\.nbr-wrapper\s*\{[^}]*box-sizing:\s*border-box/);
  assert.match(layout, /inline-size:\s*100%/);
  assert.match(layout, /max-inline-size:\s*var\(--nbr-wrapper-max,/);
  assert.match(layout, /margin-inline:\s*auto/);
  assert.match(layout, /padding-inline:\s*var\(--nbr-wrapper-gutter,/);
  assert.doesNotMatch(layout, /2\s*\*|\*\s*2/);
});

test('pressable geometry mirrors its small offset in RTL and preserves fixed escape', () => {
  assert.match(primitives, /--nbr-shadow-offset-small/);
  assert.match(primitives, /--nbr-press-sign:\s*-1/);
  assert.match(primitives, /translate\(calc\(var\(--nbr-press-sign\)\s*\*\s*var\(--nbr-press-inline/);
  assert.match(primitives, /\[data-nbr-shadow-direction="fixed"\]\s*\{\s*--nbr-shadow-inline:\s*var\(--nbr-shadow-offset-raised\)/);
  assert.match(primitives, /prefers-reduced-motion/);
  assert.match(primitives, /forced-colors/);
});
