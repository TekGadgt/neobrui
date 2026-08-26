import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import packageJson from '../package.json' with { type: 'json' };
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { generateCss } from '../src/tokens/tokens.mjs';
import { themes } from '../fixtures/inputs.mjs';
import { REQUIRED_ROLES, validateTokens } from '../src/tokens/schema.mjs';
import { buildSizeCandidate } from '../scripts/size-package.mjs';

const base = structuredClone(themes['personal-light']);

const unknownFamily = { ...base, brand: { accent: '#123456' } };
assert.ok(validateTokens(unknownFamily).some(error => error.includes('brand')));
assert.throws(() => generateCss({ invalid: unknownFamily }), /Unknown token family "brand"/);

const unknownRole = { ...base, color: { ...base.color, brand: '#123456' } };
assert.ok(validateTokens(unknownRole).some(error => error.includes('color.brand')));
assert.throws(() => generateCss({ invalid: unknownRole }), /Unknown token role "color.brand"/);

for (const fixture of ['personal-light', 'personal-dark', 'workshop', 'nested-theme', 'neutralized']) {
  const fixturePath = path.join('fixtures', fixture, 'index.html');
  const html = await readFile(fixturePath, 'utf8');
  assert.match(html, /data-theme=/, fixture);
  assert.doesNotMatch(html, /<script\b/i, fixture);
}

const boundaryFiles = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ['dist', 'node_modules', '.astro'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else boundaryFiles.push(file);
  }
}
for (const directory of ['src', 'scripts', 'fixtures', 'tests', 'evidence', 'decisions']) {
  await collect(directory);
}
const scannedFiles = boundaryFiles.filter(file => (file.startsWith('src/') || file.startsWith('scripts/') || file.startsWith('fixtures/plain/') || file.startsWith('fixtures/blocks/') || file.startsWith('fixtures/shadows/')) && file !== 'tests/remediation.test.mjs' && !file.includes('/node_modules/') && !file.includes('/dist/') && !file.includes('/.astro/'));
const source = (await Promise.all(scannedFiles.map(file => readFile(file, 'utf8')))).join('\n');
assert.doesNotMatch(source, /(?:personal_site|htmlday-lite)/i);
// Fixture package names and evidence may name integrations; core must not
// couple selectors or markup to a framework implementation.
const coreSource = (await Promise.all(boundaryFiles.filter(file => file.startsWith('src/') || file.startsWith('scripts/')).map(file => readFile(file, 'utf8')))).join('\n');
assert.doesNotMatch(coreSource, /(?:<|\.)\s*(?:astro|react|storybook|tailwind)(?:[\s.:{>])/i);
assert.doesNotMatch(source, /(?:editor|preview|creator|takeaway|portfolio|brand)\s*[:=]/i);
assert.doesNotMatch(source, /\.json\s*['"]?\s*[:=]/i);

// Reproducibility contracts: these checks intentionally fail until the
// fixture owns its generated tokens and verification is non-mutating.
assert.match(await readFile('fixtures/tailwind/input.css', 'utf8'), /generated-tokens\.css/);
const tailwindOutput = await readFile('fixtures/tailwind/dist/output.css', 'utf8');
assert.match(tailwindOutput, /--nbr-(?:color|surface)-/);
assert.match(tailwindOutput, /--nbr-button-background:var\(--nbr-color-action\)/);
assert.equal(packageJson.devDependencies.vite, '7.3.6');
assert.equal(packageJson.devDependencies['@playwright/test'], '1.62.1');
assert.equal(packageJson.devDependencies['@axe-core/playwright'], '4.13.0');
assert.match(await readFile('tests/coexistence.spec.js', 'utf8'), /CAPTURE_EVIDENCE/);
assert.match(await readFile('tests/shadow-direction.spec.js', 'utf8'), /CAPTURE_EVIDENCE/);

// Evidence capture must be explicit, Chromium-scoped, ignored, and isolated
// from committed screenshots. These contracts intentionally fail on the old
// tracked-path capture implementation.
const coexistenceSpec = await readFile('tests/coexistence.spec.js', 'utf8');
const shadowsSpec = await readFile('tests/shadow-direction.spec.js', 'utf8');
const packageScripts = packageJson.scripts;
const gitignore = await readFile('.gitignore', 'utf8');
assert.match(packageScripts['capture:chromium'], /CAPTURE_EVIDENCE=1 pnpm exec playwright test --project=chromium/);
assert.match(packageScripts.verify, /build:fixtures/);
assert.match(packageScripts['verify:clean'], /scripts\/verify-clean\.mjs/);
assert.match(packageScripts.test, /node --test tests\/\*\.test\.mjs/);
assert.match(await readFile('scripts/verify-clean.mjs', 'utf8'), /waitForOwnedPreviewExit/);
assert.match(await readFile('scripts/preview-process.mjs', 'utf8'), /PREVIEW_TEARDOWN_TIMEOUT/);
assert.match(await readFile('playwright.config.js', 'utf8'), /production-fixtures-server\.mjs 4174/);
assert.match(await readFile('tests/production-fixtures.spec.js', 'utf8'), /panel_/);
assert.match(coexistenceSpec, /[.]evidence-cache\/screenshots\/coexistence-matrix-\$\{browserName\}\.png/);
assert.match(coexistenceSpec, /[.]evidence-cache\/screenshots\/coexistence-hostile-\$\{browserName\}\.png/);
assert.match(shadowsSpec, /[.]evidence-cache\/screenshots\/shadows-\$\{browserName\}-\$\{name\}\.png/);
assert.doesNotMatch(coexistenceSpec, /evidence\/screenshots\//);
assert.doesNotMatch(shadowsSpec, /evidence\/screenshots\//);
assert.match(gitignore, /^\.evidence-cache\/$/m);

// Current-contract regression boundary: legacy names are permitted only in
// explicitly path-based historical evidence/ADR roots. Generated output,
// package archives, and runtime fixture output are current contract too.
const currentRoots = [
  'src', 'scripts', 'fixtures', 'tests',
  'docs/getting-started-personal-use.md', 'docs/expansion-roadmap.md',
  'docs/status-and-support.md',
  'docs/manual-accessibility-testing.md',
  'docs/templates/accessibility-test-run.md', 'package.json',
  'dist', 'fixtures/css-modules/dist',
  'fixtures/astro/dist', 'fixtures/tailwind/dist', 'tmp/remediation-size',
  'evidence', 'decisions',
];
const historicalPath = /(?:^|\/)(?:evidence|decisions)(?:\/|$)/;
const legacyMarkers = /_nb-spike|--_nb-|data-_nb-|neobrui\.recipes|src\/recipes|\bSpike\b|\brecipes?\b/i;
const sizeOutput = 'tmp/remediation-size';
await buildSizeCandidate({ outputRoot: sizeOutput });
const currentFiles = [];
async function collectCurrent(entry) {
  const info = await stat(entry);
  if (info.isDirectory()) {
    if (['node_modules', '.astro', '.qa-rehearsal', '.evidence-cache'].includes(entry.split('/').at(-1))) return;
    for (const child of await readdir(entry)) await collectCurrent(`${entry}/${child}`);
  } else currentFiles.push(entry);
}
for (const root of currentRoots) await collectCurrent(root);
const currentTestFiles = new Set(['tests/remediation.test.mjs', 'tests/cube-contract.test.mjs', 'tests/qa-rehearsal.test.mjs']);
function currentText(file, text) {
  if (historicalPath.test(file) || currentTestFiles.has(file)) return;
  assert.doesNotMatch(text, legacyMarkers, `legacy current contract in ${file}`);
}
function archiveTextEntries(file) {
  return execFileSync('tar', ['-tzf', file], { encoding: 'utf8' }).split('\n').filter(entry => entry && !entry.endsWith('/'))
    .map(entry => execFileSync('tar', ['-xOf', file, entry], { encoding: 'utf8' }));
}
for (const file of currentFiles) {
  if (file.endsWith('.tgz')) {
    for (const text of archiveTextEntries(file)) currentText(`${file} archive entry`, text);
  } else currentText(file, await readFile(file, 'utf8'));
}

// Regression proof: a marker in generated/package output must fail even when
// its line calls itself historical. This guards against the old line waiver.
const probeRoot = await mkdtemp('tmp/remediation-legacy-probe-');
const probeFile = `${probeRoot}/generated.css`;
await writeFile(probeFile, '/* historical evidence */ ._nb-spike-button { color: red; }\n');
assert.throws(() => currentText(probeFile, '/* historical evidence */ ._nb-spike-button { color: red; }'), /legacy current contract/);
await rm(probeRoot, { recursive: true, force: true });

// Every current Markdown link must resolve to a repository file or directory.
for (const file of currentFiles.filter(file => file.endsWith('.md'))) {
  const text = await readFile(file, 'utf8');
  for (const [, target] of text.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]+)?\)/g)) {
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    const resolved = path.resolve(path.dirname(file), target);
    await import('node:fs/promises').then(({ access }) => access(resolved)).catch(() => assert.fail(`broken Markdown link ${file} -> ${target}`));
  }
}

const aggregateCss = await readFile(`${sizeOutput}/dist/blocks.css`, 'utf8');
const aggregateLayers = aggregateCss.match(/^@layer ([^;]+);/m)?.[1].split(/,\s*/);
assert.deepEqual(aggregateLayers, ['nbr.tokens', 'nbr.compositions', 'nbr.utilities', 'nbr.blocks', 'nbr.exceptions']);
assert.equal(new Set(aggregateLayers).size, aggregateLayers.length);

console.log(`remediation tests: ${boundaryFiles.length} files, ${Object.keys(REQUIRED_ROLES).length} families`);
