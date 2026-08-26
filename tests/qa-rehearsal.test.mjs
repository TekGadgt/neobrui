import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { generateVariant, SEEDS } from '../scripts/qa-rehearsal.mjs';

const ALLOWED_STATUSES = new Set(['passed', 'failed', 'manual-unavailable', 'not-triggered', 'not-run']);
const CHECKLIST_IDS = ['PR-1', 'PR-2', 'PR-3', 'RC-1', 'RC-2', 'RC-3', 'AUD-1', 'AUD-2', 'AUD-3', 'SLICE-1', 'SLICE-2'];

function checklistFromMarkdown(markdown) {
  return Object.fromEntries([...markdown.matchAll(/^\|\s*([A-Z]+-\d+)\s*\|[^|]*\|\s*([^|]+?)\s*\|/gm)].map(([, id, status]) => [id, status.trim()]));
}

function checklistFromJson(json) {
  return Object.fromEntries(Object.values(json.checklists).flatMap(section => Object.entries(section).map(([id, value]) => [id, value.status])));
}

function checklistFromSummary(summary) {
  return Object.fromEntries([...summary.matchAll(/\b(PR-1|PR-2|PR-3|RC-1|RC-2|RC-3|AUD-1|AUD-2|AUD-3|SLICE-1|SLICE-2)\s+`([^`]+)`/g)].map(([, id, status]) => [id, status]));
}

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

test('committed checklist sources use the same canonical IDs and statuses', async () => {
  const markdown = checklistFromMarkdown(await readFile('evidence/qa-checklists.md', 'utf8'));
  const json = checklistFromJson(JSON.parse(await readFile('evidence/qa-timings.json', 'utf8')));
  const summary = checklistFromSummary(await readFile('evidence/spike-6-qa-rehearsal.md', 'utf8'));
  for (const source of [markdown, json, summary]) {
    assert.deepEqual(Object.keys(source).sort(), CHECKLIST_IDS.sort());
    assert.deepEqual([...new Set(Object.values(source))].filter(status => !ALLOWED_STATUSES.has(status)), []);
  }
  assert.deepEqual(markdown, json);
  assert.deepEqual(summary, json);
});
