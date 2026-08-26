import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSizeCandidate, verifySizeReport } from '../scripts/size-package.mjs';

test('size candidate reports deterministic CSS artifacts and threshold verdicts', async () => {
  const first = await buildSizeCandidate({ outputRoot: 'tmp/size-test-a' });
  const second = await buildSizeCandidate({ outputRoot: 'tmp/size-test-b' });
  assert.equal(first.schemaVersion, 1);
  assert.deepEqual(first.entries.map(({ name }) => name), [
    'foundations', 'stack', 'cluster', 'visuallyHidden', 'wrapper', 'surface', 'button', 'field', 'blocks', 'consumer',
  ]);
  assert.ok(first.entries.every((entry) => entry.rawBytes >= entry.minifiedBytes));
  assert.deepEqual(first.entries.map((entry) => entry.sha256), second.entries.map((entry) => entry.sha256));
  assert.equal(first.verdict, 'warning/narrow');
  assert.equal(verifySizeReport(first), true);
});

test('candidate archive is CSS-only and has explicit subpath exports', async () => {
  const report = await buildSizeCandidate({ outputRoot: 'tmp/size-test-archive' });
  assert.deepEqual(report.archive.files.map(({ path }) => path), [
    'README.md', 'dist/blocks.css', 'dist/button.css', 'dist/cluster.css', 'dist/field.css',
    'dist/foundations.css', 'dist/stack.css', 'dist/surface.css', 'dist/visually-hidden.css', 'dist/wrapper.css', 'package.json',
  ]);
  assert.equal(report.archive.runtimeJavaScriptBytes, 0);
  assert.equal(report.archive.runtimeAssetBytes, 0);
  assert.deepEqual(Object.keys(report.archive.exports), ['.', './foundations', './surface', './button', './field', './blocks', './compositions/stack', './compositions/cluster', './utilities/visually-hidden', './utilities/wrapper']);
  const aggregate = await (await import('node:fs/promises')).readFile('tmp/size-test-archive/package/dist/blocks.css', 'utf8');
  const declaration = aggregate.match(/^@layer ([^;]+);/m)?.[1].split(/,\s*/);
  assert.deepEqual(declaration, ['nbr.tokens', 'nbr.compositions', 'nbr.utilities', 'nbr.blocks', 'nbr.exceptions']);
  assert.equal(new Set(declaration).size, declaration.length);
});

test('archive block outputs own the nbr.blocks layer and preserve cascade precedence', async () => {
  await buildSizeCandidate({ outputRoot: 'tmp/size-test-layer-ownership' });
  const fs = await import('node:fs/promises');
  const names = ['surface', 'button', 'field', 'blocks'];
  const css = Object.fromEntries(await Promise.all(names.map(async (name) => [
    name, await fs.readFile(`tmp/size-test-layer-ownership/package/dist/${name}.css`, 'utf8'),
  ])));
  for (const name of ['surface', 'button', 'field']) {
    assert.match(css[name], /^@layer nbr\.blocks\{/);
    assert.doesNotMatch(css[name], /(^|\n)(?!@layer)[^{]+\{/);
  }
  const aggregate = css.blocks;
  assert.match(aggregate, /^@layer nbr\.tokens,nbr\.compositions,nbr\.utilities,nbr\.blocks,nbr\.exceptions;/);
  assert.equal((aggregate.match(/@layer nbr\.blocks\{/g) ?? []).length, 3);
  assert.ok(aggregate.indexOf('@layer nbr.tokens') < aggregate.indexOf('@layer nbr.blocks'));
});

test('consumer accounting measures the emitted Vite CSS separately from source entries', async () => {
  const report = await buildSizeCandidate({ outputRoot: 'tmp/size-test-emitted' });
  assert.match(report.consumer.emitted.filename, /^assets\/index-[^/]+\.css$/);
  assert.equal(report.consumer.emitted.rawBytes, 7552);
  assert.equal(report.consumer.emitted.gzipBytes, 1318);
  assert.match(report.consumer.emitted.sha256, /^[0-9a-f]{64}$/);
  assert.equal(report.consumer.emitted.contentEncoding, 'identity');
  assert.match(report.consumer.emitted.packageJsonSha256, /^[0-9a-f]{64}$/);
  assert.match(report.consumer.emitted.lockfileSha256, /^[0-9a-f]{64}$/);
  assert.equal(report.consumer.emitted.runtimeDependency, 'file:neobrui-private.tgz');
  assert.equal(report.consumer.emitted.tooling, 'root-harness Vite 7.3.6');
  assert.equal(report.consumer.transferredCssBytes, 7552);
  assert.equal(report.consumer.sourceMinifiedBytes, 6757);
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
