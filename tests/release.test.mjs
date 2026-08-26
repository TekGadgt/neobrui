import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildRelease } from '../scripts/release.mjs';
import { createDeterministicArchive, validateArchiveMembers } from '../scripts/create-archive.mjs';
import { mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

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

test('member-list validation rejects ambiguous paths before filesystem access', () => {
  assert.throws(
    () => validateArchiveMembers(['nested/valid.txt', 'NESTED/VALID.TXT']),
    /duplicate archive path is not allowed: NESTED\/VALID\.TXT/,
  );
  assert.throws(
    () => validateArchiveMembers(['nested/valid.txt', 'nested/valid.txt']),
    /duplicate archive path is not allowed: nested\/valid\.txt/,
  );
  assert.deepEqual(
    validateArchiveMembers(['z.txt', 'nested/a.txt']),
    ['nested/a.txt', 'z.txt'],
  );
});

test('deterministic archive accepts explicit safe sorted files and rejects symlinks', async () => {
  const root = 'tmp/archive-fixture';
  await mkdir(join(root, 'nested'), { recursive: true });
  await writeFile(join(root, 'z.txt'), 'z');
  await writeFile(join(root, 'nested', 'a.txt'), 'a');
  await assert.rejects(() => createDeterministicArchive({ root, output: 'tmp/archive-invalid.tgz', files: ['../escape'] }), /unsafe archive path/);
  await assert.rejects(() => createDeterministicArchive({ root, output: 'tmp/archive-invalid.tgz', files: ['z.txt', '/absolute'] }), /unsafe archive path/);
  await assert.rejects(() => createDeterministicArchive({ root, output: 'tmp/archive-invalid.tgz', files: ['nested', 'z.txt'] }), /symlink|directory/);
  const result = await createDeterministicArchive({ root, output: 'tmp/archive-fixture.tgz', files: ['z.txt', 'nested/a.txt'] });
  assert.deepEqual(result.files, ['nested/a.txt', 'z.txt']);
  const tar = await import('tar');
  const entries = [];
  await tar.list({ file: 'tmp/archive-fixture.tgz', onReadEntry: entry => entries.push({ path: entry.path, mode: entry.mode, uid: entry.uid, gid: entry.gid, mtime: entry.mtime }) });
  assert.deepEqual(entries.map(entry => entry.path), result.files);
  assert.ok(entries.every(entry => entry.uid === undefined && entry.gid === undefined && entry.mtime.getTime() === 0));
});

test('archive rejects symlinked ancestors and unsafe member paths before creating output', async () => {
  const root = 'tmp/archive-safety-root';
  const outside = 'tmp/archive-safety-outside';
  const output = 'tmp/archive-safety-invalid.tgz';
  await rm(root, { recursive: true, force: true });
  await rm(outside, { recursive: true, force: true });
  await rm(output, { force: true });
  await mkdir(join(root, 'nested'), { recursive: true });
  await mkdir(join(outside, 'deep'), { recursive: true });
  await writeFile(join(root, 'nested', 'valid.txt'), 'valid');
  await writeFile(join(outside, 'secret.css'), 'must not be read');
  await writeFile(join(outside, 'deep', 'secret.css'), 'must not be read');
  await symlink(join('..', 'archive-safety-outside'), join(root, 'link'));
  await symlink(join('..', 'outside-missing'), join(root, 'chain'));
  await symlink(join('..', 'archive-safety-outside', 'deep'), join(root, 'link-to-deep'));

  const rejects = [
    ['symlinked parent escape', ['link/secret.css'], /symlink.*link/],
    ['nested symlink chain', ['link-to-deep/secret.css'], /symlink.*link-to-deep/],
    ['final symlink', ['link'], /symlink.*link/],
    ['dot segment', ['nested/./valid.txt'], /unsafe archive path/],
    ['parent segment', ['nested/../valid.txt'], /unsafe archive path/],
    ['absolute path', ['/etc/passwd'], /unsafe archive path/],
    ['backslash escape', ['nested\\\\..\\\\secret.css'], /unsafe archive path/],
    ['drive path', ['C:\\\\secret.css'], /unsafe archive path/],
    ['UNC path', ['\\\\\\\\server\\\\secret.css'], /unsafe archive path/],
    ['NUL path', ['nested/valid.txt\0secret'], /unsafe archive path/],
    ['case-ambiguous duplicate', ['nested/valid.txt', 'NESTED/VALID.TXT'], /duplicate archive path/],
    ['missing path', ['chain/secret.css'], /symlink.*chain/],
    ['directory final', ['nested'], /directory or unsupported/],
  ];
  for (const [name, files, diagnostic] of rejects) {
    await assert.rejects(
      () => createDeterministicArchive({ root, output, files }),
      diagnostic,
      name,
    );
    assert.equal(await readFile(output).catch(() => null), null, `${name} created an archive`);
  }

  const result = await createDeterministicArchive({ root, output, files: ['nested/valid.txt'] });
  assert.deepEqual(result.files, ['nested/valid.txt']);
});
