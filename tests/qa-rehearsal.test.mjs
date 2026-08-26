import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { generateVariant, SEEDS } from '../scripts/qa-rehearsal.mjs';

test('QA generator exposes exactly the three independent seeds', () => {
  assert.deepEqual(SEEDS, ['missing-label', 'clipping-320', 'shadow-only-focus']);
  for (const seed of SEEDS) {
    const html = generateVariant(seed);
    assert.match(html, /data-qa-seed/);
  }
});

test('QA output is test-only and cannot enter canonical package paths', async () => {
  const ignore = await readFile('.gitignore', 'utf8');
  assert.match(ignore, /^\.qa-rehearsal\/$/m);
  assert.doesNotMatch(generateVariant('combined'), /<script\b/i);
});
