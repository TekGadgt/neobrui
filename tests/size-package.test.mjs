import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSizeCandidate, verifySizeReport } from '../scripts/size-package.mjs';

test('size candidate reports deterministic CSS artifacts and threshold verdicts', async () => {
  const first = await buildSizeCandidate({ outputRoot: 'tmp/size-test-a' });
  const second = await buildSizeCandidate({ outputRoot: 'tmp/size-test-b' });
  assert.equal(first.schemaVersion, 1);
  assert.deepEqual(first.entries.map(({ name }) => name), [
    'foundations', 'surface', 'button', 'field', 'blocks', 'consumer',
  ]);
  assert.ok(first.entries.every((entry) => entry.rawBytes >= entry.minifiedBytes));
  assert.deepEqual(first.entries.map((entry) => entry.sha256), second.entries.map((entry) => entry.sha256));
  assert.equal(first.verdict, 'warning/narrow');
  assert.equal(verifySizeReport(first), true);
});

test('candidate archive is CSS-only and has explicit subpath exports', async () => {
  const report = await buildSizeCandidate({ outputRoot: 'tmp/size-test-archive' });
  assert.deepEqual(report.archive.files.map(({ path }) => path), [
    'README.md', 'dist/blocks.css', 'dist/button.css', 'dist/field.css',
    'dist/foundations.css', 'dist/surface.css', 'package.json',
  ]);
  assert.equal(report.archive.runtimeJavaScriptBytes, 0);
  assert.equal(report.archive.runtimeAssetBytes, 0);
  assert.deepEqual(Object.keys(report.archive.exports), ['.', './foundations', './surface', './button', './field', './blocks']);
  const aggregate = await (await import('node:fs/promises')).readFile('tmp/size-test-archive/package/dist/blocks.css', 'utf8');
  const declaration = aggregate.match(/^@layer ([^;]+);/m)?.[1].split(/,\s*/);
  assert.deepEqual(declaration, ['nbr.tokens', 'nbr.compositions', 'nbr.utilities', 'nbr.blocks', 'nbr.exceptions']);
  assert.equal(new Set(declaration).size, declaration.length);
});

test('consumer accounting measures the emitted Vite CSS separately from source entries', async () => {
  const report = await buildSizeCandidate({ outputRoot: 'tmp/size-test-emitted' });
  assert.match(report.consumer.emitted.filename, /^assets\/index-[^/]+\.css$/);
  assert.equal(report.consumer.emitted.rawBytes, 4465);
  assert.equal(report.consumer.emitted.gzipBytes, 1071);
  assert.match(report.consumer.emitted.sha256, /^[0-9a-f]{64}$/);
  assert.equal(report.consumer.emitted.contentEncoding, 'identity');
  assert.match(report.consumer.emitted.packageJsonSha256, /^[0-9a-f]{64}$/);
  assert.match(report.consumer.emitted.lockfileSha256, /^[0-9a-f]{64}$/);
  assert.equal(report.consumer.emitted.runtimeDependency, 'file:neobrui-private.tgz');
  assert.equal(report.consumer.emitted.tooling, 'root-harness Vite 7.3.6');
  assert.equal(report.consumer.transferredCssBytes, 4465);
  assert.equal(report.consumer.sourceMinifiedBytes, 5949);
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
