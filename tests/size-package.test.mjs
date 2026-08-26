import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSizeCandidate, verifySizeReport } from '../scripts/size-spike.mjs';

test('size candidate reports deterministic CSS artifacts and threshold verdicts', async () => {
  const first = await buildSizeCandidate({ outputRoot: 'tmp/size-test-a' });
  const second = await buildSizeCandidate({ outputRoot: 'tmp/size-test-b' });
  assert.equal(first.schemaVersion, 1);
  assert.deepEqual(first.entries.map(({ name }) => name), [
    'foundations', 'surface', 'button', 'field', 'recipes', 'consumer',
  ]);
  assert.ok(first.entries.every((entry) => entry.rawBytes >= entry.minifiedBytes));
  assert.deepEqual(first.entries.map((entry) => entry.sha256), second.entries.map((entry) => entry.sha256));
  assert.equal(first.verdict, 'warning/narrow');
  assert.equal(verifySizeReport(first), true);
});

test('candidate archive is CSS-only and has explicit subpath exports', async () => {
  const report = await buildSizeCandidate({ outputRoot: 'tmp/size-test-archive' });
  assert.deepEqual(report.archive.files.map(({ path }) => path), [
    'README.md', 'dist/button.css', 'dist/field.css', 'dist/foundations.css',
    'dist/recipes.css', 'dist/surface.css', 'package.json',
  ]);
  assert.equal(report.archive.runtimeJavaScriptBytes, 0);
  assert.equal(report.archive.runtimeAssetBytes, 0);
  assert.deepEqual(Object.keys(report.archive.exports), ['.', './foundations', './surface', './button', './field', './recipes']);
});
