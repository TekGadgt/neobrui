import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();
const expected = new Set([
  'LICENSE', 'README.md', 'package.json',
  'src/foundations.css', 'src/index.css', 'src/layout.css', 'src/primitives.css', 'src/utilities.css',
  'docs/design-system/0001-centralized-neobrui-reset.md', 'skills/neobrui/SKILL.md',
  'skills/neobrui/references/api.md', 'skills/neobrui/references/examples.md',
  'skills/neobrui/templates/verification.md',
]);

test('real npm archive is allowlisted and consumable', () => {
  const temp = mkdtempSync(join(tmpdir(), 'neobrui-pack-'));
  let archive;
  try {
    const result = JSON.parse(execFileSync('npm', ['pack', '--json'], { cwd: root, encoding: 'utf8' }));
    archive = join(root, result[0].filename);
    const files = new Set(result[0].files.map(file => file.path));
    assert.deepEqual(files, expected);
    assert.equal(result[0].size > 0, true);
    const checksum = createHash('sha256').update(readFileSync(archive)).digest('hex');
    console.log(`archive sha256: ${checksum}`);
    assert.match(checksum, /^[a-f0-9]{64}$/);
    execFileSync('npm', ['init', '-y'], { cwd: temp, stdio: 'ignore' });
    execFileSync('npm', ['install', '--ignore-scripts', '--offline', '--no-audit', '--no-fund', archive], { cwd: temp, stdio: 'pipe' });
    for (const name of ['neobrui', 'neobrui/foundations.css', 'neobrui/layout.css', 'neobrui/primitives.css', 'neobrui/utilities.css']) {
      const path = name === 'neobrui' ? join(temp, 'node_modules/neobrui/src/index.css') : join(temp, 'node_modules/neobrui/src', name.split('/')[1]);
      assert.ok(readFileSync(path, 'utf8').length, `${name} should be readable`);
    }
  } finally {
    if (archive) rmSync(archive, { force: true });
    rmSync(temp, { recursive: true, force: true });
  }
});
