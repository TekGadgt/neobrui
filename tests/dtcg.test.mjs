import test from 'node:test';
import assert from 'node:assert/strict';
import { themes } from '../fixtures/inputs.mjs';
import { DTCG_VERSION, exportDtcg, importDtcg, roundTripDtcg, generateThemeManifest, generateCss } from '../src/tokens/dtcg.mjs';

test('exports deterministic DTCG 2025.10 with types and stable paths', () => {
  const options = { selectors: { 'personal-light': '.site-light', 'personal-dark': '[data-product-theme="dark"]', neutralized: '.site-neutral' } };
  const first = exportDtcg({ 'personal-light': themes['personal-light'] }, options);
  const second = exportDtcg({ 'personal-light': themes['personal-light'] }, options);
  assert.equal(first, second);
  const parsed = JSON.parse(first);
  assert.equal(parsed.$extensions['org.neobrui'].formatVersion, DTCG_VERSION);
  assert.equal(parsed.color.text.$type, 'color');
  assert.equal(parsed.color.text.$value, '#171512');
  assert.equal(parsed.$extensions['org.neobrui'].themes['personal-light'].selector, '.site-light');
  assert.equal(first.endsWith('\n'), true);
});

test('rejects unknown extensions, collisions, and incomplete themes', () => {
  assert.throws(() => importDtcg(JSON.stringify({ color: { text: { $value: '#fff', $type: 'wat' } } })), /unknown type/i);
  assert.throws(() => exportDtcg({ light: { ...themes['personal-light'], extra: { role: '#fff' } } }), /Unknown token family/);
  assert.throws(() => exportDtcg({ light: { ...themes['personal-light'], color: { ...themes['personal-light'].color, textMuted: '#111', 'text-muted': '#222' } } }), /collision/i);
});

test('supports bounded alias round trip and product-owned selector CSS equivalence', () => {
  const source = { light: { ...themes['personal-light'], color: { ...themes['personal-light'].color, text: { $value: '{color.textMuted}', $type: 'color' } } } };
  const text = exportDtcg(source, { selectors: { light: '.product-light' } });
  const imported = importDtcg(text);
  assert.equal(imported.color.text.$value, '{color.textMuted}');
  assert.equal(roundTripDtcg(text), text);
  assert.match(generateCss({ light: themes['personal-light'] }, { selectors: { light: '.product-light' } }), /\.product-light/);
  assert.deepEqual(generateThemeManifest({ light: themes['personal-light'] }, { selectors: { light: '.product-light' } }).themes.light, { selector: '.product-light' });
});
