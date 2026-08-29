import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyTag, validateManifest, compareReports } from '../tools/release-rehearsal.mjs';

test('classifies the exact prerelease tag as next', () => {
  assert.deepEqual(classifyTag('v0.1.0-alpha.0', '0.1.0-alpha.0'), {
    tag: 'v0.1.0-alpha.0', version: '0.1.0-alpha.0', channel: 'next', prerelease: true,
  });
});

test('rejects a tag that does not match the package version', () => {
  assert.throws(() => classifyTag('v0.1.0-alpha.1', '0.1.0-alpha.0'), /does not match/);
});

test('validates the release safety manifest contract', () => {
  assert.doesNotThrow(() => validateManifest({
    name: '@tekgadgt/neobrui', version: '0.1.0-alpha.0', private: true,
    license: 'MIT', sideEffects: ['*.css'], publishConfig: { registry: 'https://registry.npmjs.org/', access: 'public' },
    exports: { '.': { style: './src/index.css', default: './src/index.css' }, './foundations.css': './src/foundations.css', './layout.css': './src/layout.css', './primitives.css': './src/primitives.css', './utilities.css': './src/utilities.css', './package.json': './package.json' }, files: ['src', 'README.md', 'LICENSE', 'skills/neobrui'],
    scripts: { test: 'node --test' },
  }));
});

test('compares semantic reports while allowing platform fields to differ', () => {
  const base = { schema: 'neobrui-release-rehearsal/v1', sourceSha: 'abc', platform: 'linux', arch: 'arm64', tools: { node: 'v26' }, package: { name: 'x' }, files: ['a'], archive: { sha256: 'same' }, consumer: { installed: true } };
  const other = structuredClone(base); other.platform = 'darwin'; other.arch = 'x64';
  assert.doesNotThrow(() => compareReports(base, other));
  other.archive.sha256 = 'different';
  assert.throws(() => compareReports(base, other), /archive sha256/);
});
