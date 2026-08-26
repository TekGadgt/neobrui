import test from 'node:test';
import assert from 'node:assert/strict';
import { themes } from '../fixtures/inputs.mjs';
import { DTCG_VERSION, exportDtcg, importDtcg, roundTripDtcg, generateThemeManifest, generateCss, generateDtcgBundle } from '../src/tokens/dtcg.mjs';

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
  assert.throws(() => importDtcg(JSON.stringify({ $schema: 'https://tr.designtokens.org/format/2025.10', color: { text: { $value: '#fff', $type: 'wat' } } })), /unknown type/i);
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

test('reports direct and multi-node alias cycles with deterministic paths', () => {
  const direct = { ...themes['personal-light'], color: { ...themes['personal-light'].color, text: { $value: '{color.text}', $type: 'color' } } };
  assert.throws(() => exportDtcg({ light: direct }), /Alias cycle: color\.text -> color\.text/);
  const multi = { ...themes['personal-light'], color: { ...themes['personal-light'].color, text: { $value: '{color.textMuted}', $type: 'color' }, textMuted: { $value: '{color.text}', $type: 'color' } } };
  assert.throws(() => exportDtcg({ light: multi }), /Alias cycle: color\.text -> color\.textMuted -> color\.text/);
});

test('requires explicit per-theme bundles and preserves distinct values', () => {
  assert.throws(() => exportDtcg({ light: themes['personal-light'], dark: themes['personal-dark'] }), /ambiguous multi-theme/i);
  const bundle = generateDtcgBundle({ dark: themes['personal-dark'], light: themes['personal-light'] });
  assert.deepEqual(Object.keys(bundle.artifacts), ['dark', 'light']);
  assert.equal(bundle.artifacts.light.color.text.$value, '#171512');
  assert.equal(bundle.artifacts.dark.color.text.$value, '#f4f0e8');
  assert.deepEqual(Object.keys(bundle.manifest.themes), ['dark', 'light']);
});

test('fails closed for unsupported root, token, description, and extension properties', () => {
  const valid = JSON.parse(exportDtcg({ light: themes['personal-light'] }));
  for (const mutate of [
    doc => { doc.extra = {}; },
    doc => { doc.color.text.extra = true; },
    doc => { doc.color.text.$description = 'not supported'; },
    doc => { doc.$extensions['org.neobrui'].unknown = true; },
    doc => { doc.$extensions.other = {}; },
  ]) {
    const candidate = structuredClone(valid);
    mutate(candidate);
    assert.throws(() => importDtcg(candidate));
  }
});
