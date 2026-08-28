import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = () => readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('aggregate entry exposes only the opt-in CSS layers', async () => {
  const source = await css();
  assert.match(source, /foundations\.css/);
  assert.match(source, /layout\.css/);
  assert.match(source, /primitives\.css/);
  assert.doesNotMatch(source, /reset|button\.css|field\.css|tailwind/i);
});

test('package has semantic primitives and no bare element reset', async () => {
  const source = await readFile(new URL('../src/primitives.css', import.meta.url), 'utf8');
  assert.match(source, /\.nbr-surface/);
  assert.match(source, /\.nbr-pressable/);
  assert.doesNotMatch(source, /!important/);
  assert.doesNotMatch(source, /(^|\})\s*(button|input|a|html|body)\s*\{/);
});
