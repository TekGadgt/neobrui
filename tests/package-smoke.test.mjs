import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseNpmPackJson } from '../tools/npm-pack-result.mjs';

const root = process.cwd();
const expected = new Set([
  'LICENSE', 'README.md', 'package.json',
  'src/foundations.css', 'src/index.css', 'src/layout.css', 'src/primitives.css', 'src/utilities.css',
  'skills/neobrui/SKILL.md',
  'skills/neobrui/references/api.md', 'skills/neobrui/references/examples.md',
  'skills/neobrui/templates/verification.md',
]);

test('real npm archive is allowlisted and consumable', () => {
  const temp = mkdtempSync(join(tmpdir(), 'neobrui-pack-'));
  let archive;
  try {
    const result = parseNpmPackJson(execFileSync('npm', ['pack', '--json'], { cwd: root, encoding: 'utf8' }), '@tekgadgt/neobrui');
    archive = join(root, result.filename);
    const files = new Set(result.files.map(file => file.path));
    assert.deepEqual(files, expected);
    assert.equal(result.size > 0, true);
    const checksum = createHash('sha256').update(readFileSync(archive)).digest('hex');
    console.log(`archive sha256: ${checksum}`);
    assert.match(checksum, /^[a-f0-9]{64}$/);
    execFileSync('npm', ['init', '-y'], { cwd: temp, stdio: 'ignore' });
    execFileSync('npm', ['install', '--ignore-scripts', '--offline', '--no-audit', '--no-fund', archive], { cwd: temp, stdio: 'pipe' });
    for (const name of ['@tekgadgt/neobrui', '@tekgadgt/neobrui/foundations.css', '@tekgadgt/neobrui/layout.css', '@tekgadgt/neobrui/primitives.css', '@tekgadgt/neobrui/utilities.css']) {
      const path = name === '@tekgadgt/neobrui' ? join(temp, 'node_modules/@tekgadgt/neobrui/src/index.css') : join(temp, 'node_modules/@tekgadgt/neobrui/src', name.split('/').at(-1));
      assert.ok(readFileSync(path, 'utf8').length, `${name} should be readable`);
    }
  } finally {
    if (archive) rmSync(archive, { force: true });
    rmSync(temp, { recursive: true, force: true });
  }
});
