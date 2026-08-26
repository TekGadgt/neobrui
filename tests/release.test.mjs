import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildRelease } from '../scripts/release.mjs';

test('formal release has private personal-alpha metadata and explicit exports', async () => {
  const release = await buildRelease({ outputRoot: 'tmp/release-test' });
  assert.equal(release.version, '0.1.0-alpha.0');
  assert.equal(release.package.name, 'neobrui');
  assert.equal(release.package.private, true);
  assert.equal('publishConfig' in release.package, false);
  assert.deepEqual(Object.keys(release.package.exports), [
    '.', './tokens', './tokens.dtcg.json', './compositions/stack', './compositions/cluster',
    './utilities/visually-hidden', './utilities/wrapper', './blocks/surface', './blocks/button',
    './blocks/field', './blocks', './README.md', './LICENSE',
  ]);
  assert.equal(release.archive.runtimeJavaScriptBytes, 0);
  assert.equal(release.archive.runtimeAssetBytes, 0);
  assert.match(release.archive.path, /neobrui-0\.1\.0-alpha\.0\.tgz$/);
});

test('formal release archive and checksum are byte deterministic', async () => {
  const first = await buildRelease({ outputRoot: 'tmp/release-a' });
  const second = await buildRelease({ outputRoot: 'tmp/release-b' });
  assert.equal(first.archive.sha256, second.archive.sha256);
  assert.deepEqual(first.files, second.files);
  const checksum = await readFile('tmp/release-a/SHA256SUMS', 'utf8');
  assert.match(checksum, new RegExp(`${first.archive.sha256}  neobrui-0\\.1\\.0-alpha\\.0\\.tgz`));
});
