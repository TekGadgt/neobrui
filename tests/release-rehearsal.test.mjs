import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyTag, validateManifest, compareReports, assertToolchain } from '../tools/release-rehearsal.mjs';

test('classifies the exact prerelease tag as next', () => {
  assert.deepEqual(classifyTag('v0.1.0-alpha.0', '0.1.0-alpha.0'), {
    tag: 'v0.1.0-alpha.0', version: '0.1.0-alpha.0', channel: 'next', prerelease: true,
  });
});

test('rejects a tag that does not match the package version', () => {
  assert.throws(() => classifyTag('v0.1.0-alpha.1', '0.1.0-alpha.0'), /does not match/);
});

test('enforces the release rehearsal toolchain versions', () => {
  assert.equal(assertToolchain({ node: 'v26.5.1', npm: '12.0.2', pnpm: '11.24.0' }), true);
  assert.throws(() => assertToolchain({ node: 'v25.9.0', npm: '12.0.2', pnpm: '11.24.0' }), /Node 26/);
  assert.throws(() => assertToolchain({ node: 'v26.5.1', npm: '11.17.0', pnpm: '11.24.0' }), /npm 12\.0\.2/);
  assert.throws(() => assertToolchain({ node: 'v26.5.1', npm: '12.0.2', pnpm: '10.0.0' }), /pnpm 11\.24\.0/);
});

test('validates the release safety manifest contract', () => {
  assert.doesNotThrow(() => validateManifest({
    name: '@tekgadgt/neobrui', version: '0.1.0-alpha.0', private: true,
    license: 'MIT', sideEffects: ['*.css'], publishConfig: { registry: 'https://registry.npmjs.org/', access: 'public' },
    exports: { '.': { style: './src/index.css', default: './src/index.css' }, './foundations.css': './src/foundations.css', './layout.css': './src/layout.css', './primitives.css': './src/primitives.css', './utilities.css': './src/utilities.css', './package.json': './package.json' }, files: ['src', 'README.md', 'LICENSE', 'skills/neobrui'],
    scripts: { test: 'node --test' },
  }));
});

function report() {
  return {
    schema: 'neobrui-release-rehearsal/v1', sourceSha: 'abc',
    runner: { platform: 'linux', arch: 'arm64', uname: 'Linux test', timestamp: '2026-01-01T00:00:00.000Z', stable: true },
    tools: { node: 'v26', npm: 'v12', pnpm: '11.24.0' },
    package: { name: 'x', version: '1.0.0', exports: { '.': './index.css' } }, expected: { tag: 'v1.0.0', channel: 'latest' },
    files: [{ path: 'package.json', size: 10, mode: 0o644 }],
    archive: { filename: 'x.tgz', size: 100, sha256: 'same', sri: 'sha512-same' },
    consumer: { installed: true, assertions: ['css-readable'] },
  };
}

test('allows only documented runner platform facts and informational timestamp to differ', () => {
  const other = report();
  other.runner = { ...other.runner, platform: 'darwin', arch: 'x64', uname: 'Darwin test', timestamp: '2026-01-02T00:00:00.000Z' };
  assert.doesNotThrow(() => compareReports(report(), other));
});

for (const [label, expectedPath, change] of [
  ['package.name', 'package.name', r => { r.package.name = 'different'; }],
  ['package.version', 'package.version', r => { r.package.version = '2.0.0'; }],
  ['package.exports', 'package.exports', r => { r.package.exports['./x'] = './x.css'; }],
  ['files[].size', 'files', r => { r.files[0].size = 11; }],
  ['files[].mode', 'files', r => { r.files[0].mode = 0o600; }],
  ['files order/content', 'files', r => { r.files.reverse(); r.files.push({ path: 'README.md', size: 1, mode: 0o644 }); }],
  ['archive.filename', 'archive.filename', r => { r.archive.filename = 'other.tgz'; }],
  ['archive.size', 'archive.size', r => { r.archive.size = 101; }],
  ['archive.sha256', 'archive.sha256', r => { r.archive.sha256 = 'different'; }],
  ['archive.sri', 'archive.sri', r => { r.archive.sri = 'sha512-different'; }],
  ['consumer assertion', 'consumer', r => { r.consumer.assertions = ['wrong']; }],
  ['expected channel', 'expected', r => { r.expected.channel = 'next'; }],
  ['schema', 'schema', r => { r.schema = 'other/v1'; }],
  ['source SHA', 'sourceSha', r => { r.sourceSha = 'different'; }],
  ['tool version', 'tools', r => { r.tools.node = 'v27'; }],
  ['unallowlisted runner field', 'runner', r => { r.runner.stable = false; }],
]) {
  test(`rejects ${label} mismatch with a useful path`, () => {
    const other = report(); change(other);
    assert.throws(() => compareReports(report(), other), error => error.message.includes(expectedPath));
  });
}
