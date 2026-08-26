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

test('consumer accounting measures the emitted Vite CSS separately from source entries', async () => {
  const report = await buildSizeCandidate({ outputRoot: 'tmp/size-test-emitted' });
  assert.deepEqual(report.consumer.emitted, {
    filename: 'assets/index-CkZHh2OY.css',
    rawBytes: 4667,
    gzipBytes: 1069,
    sha256: '3f692005168c906115287457219dcd47d4783ccd426934187b76fca2119be24a',
    contentEncoding: 'identity',
  });
  assert.equal(report.consumer.transferredCssBytes, 4667);
  assert.equal(report.consumer.sourceMinifiedBytes, 6076);
});

test('provenance is a stable source-input manifest, not a self-referential commit', async () => {
  const first = await buildSizeCandidate({ outputRoot: 'tmp/size-test-provenance-a' });
  const second = await buildSizeCandidate({ outputRoot: 'tmp/size-test-provenance-b' });
  assert.match(first.input.sourceManifestHash, /^[0-9a-f]{64}$/);
  assert.deepEqual(first.input.sourceManifest, second.input.sourceManifest);
  assert.equal(first.input.sourceManifestHash, second.input.sourceManifestHash);
  assert.match(first.input.workspaceState, /^(clean|dirty)$/);
  assert.equal('gitCommit' in first.input, false);
});
