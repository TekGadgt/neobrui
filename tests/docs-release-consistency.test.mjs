import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const read = (path) => readFile(path, 'utf8');

const currentDocs = [
  'README.md',
  'docs/status-and-support.md',
  'docs/current-surface.md',
  'docs/getting-started-personal-use.md',
  'docs/personal-use-viability-and-expansion.md',
  'docs/expansion-roadmap.md',
];

test('current documentation derives Button size claims from size-report.json', async () => {
  const report = JSON.parse(await read('size-report.json'));
  const button = report.entries.find(({ name }) => name === 'button');
  assert.ok(button, 'size report must contain a Button entry');
  const docs = await Promise.all(currentDocs.map(read));
  const current = docs.join('\n');
  assert.match(current, new RegExp(`${button.minifiedBytes.toLocaleString('en-US')} minified`));
  assert.match(current, new RegExp(`${button.gzipBytes.toLocaleString('en-US')} gzip`));
  assert.doesNotMatch(current, /2,413|2,322/);
});

test('current docs identify the implemented local Phase 4 alpha posture', async () => {
  const [readme, status, surface, gettingStarted, viability, roadmap, adr] = await Promise.all([
    read('README.md'),
    read('docs/status-and-support.md'),
    read('docs/current-surface.md'),
    read('docs/getting-started-personal-use.md'),
    read('docs/personal-use-viability-and-expansion.md'),
    read('docs/expansion-roadmap.md'),
    read('decisions/ADR-010-cube-migration-contract.md'),
  ]);
  for (const doc of [readme, status, surface, gettingStarted, viability, roadmap]) {
    assert.match(doc, /0\.1\.0-alpha\.0/);
    assert.match(doc, /Phase 4/);
    assert.match(doc, /private|local-only|unpublished/i);
  }
  assert.match(adr, /implemented locally/i);
  assert.match(adr, /dist\/release\/neobrui-0\.1\.0-alpha\.0\.tgz/);
  assert.match(adr, /future GitHub publication|future.*publication/i);
  assert.match(adr, /adopter/i);
});

test('release checksum verification is documented from repository root', async () => {
  const [readme, workflow] = await Promise.all([
    read('README.md'),
    read('docs/local-release-workflow.md'),
  ]);
  for (const doc of [readme, workflow]) {
    assert.match(doc, /\(cd dist\/release && sha256sum -c SHA256SUMS\)/);
  }
});

test('prepared docs artifact matches the canonical portable release archive', async () => {
  execFileSync('pnpm', ['release:local'], { stdio: 'ignore' });
  execFileSync('pnpm', ['prepare:docs'], { stdio: 'ignore' });
  const archive = await readFile('dist/release/neobrui-0.1.0-alpha.0.tgz');
  const preparedHash = await read('apps/docs/.generated/neobrui/.archive-sha256');
  const integrity = createHash('sha256').update(archive).digest('hex');
  assert.equal(preparedHash.trim(), integrity, 'prepared docs artifact must record the archive bytes');
  const [tokens, blocks] = await Promise.all([
    read('apps/docs/.generated/neobrui/dist/tokens.css'),
    read('apps/docs/.generated/neobrui/dist/blocks.css'),
  ]);
  assert.ok(tokens.length > 0 && blocks.length > 0, 'prepared docs aliases must have extracted CSS');
});

test('Pages docs build leaves tracked files unchanged with the root lock', () => {
  const before = execFileSync('git', ['diff', '--name-only'], { encoding: 'utf8' });
  execFileSync('pnpm', ['run', 'build:docs:pages'], { env: { ...process.env, CI: 'true' }, stdio: 'inherit' });
  const after = execFileSync('git', ['diff', '--name-only'], { encoding: 'utf8' });
  assert.equal(after, before, 'build:docs:pages must not rewrite tracked files');
});
