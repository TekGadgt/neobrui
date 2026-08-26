import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat, lstat, writeFile } from 'node:fs/promises';
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
assert.match(packageScripts['test:e2e'], /build:fixtures/);
assert.equal(packageScripts['test:e2e'], 'pnpm build:fixtures && playwright test');
assert.match(packageScripts.test, /node --test tests\/\*\.test\.mjs && pnpm validate:tokens && pnpm test:e2e/);
assert.match(packageScripts['capture:chromium'], /^pnpm build:fixtures && /);
assert.match(packageScripts['build:fixtures'], /build-consumer-fixture\.mjs/);
assert.match(packageScripts['verify:clean'], /scripts\/verify-clean\.mjs/);
assert.match(packageScripts.test, /node --test tests\/\*\.test\.mjs/);
const cleanVerifier = await readFile('scripts/verify-clean.mjs', 'utf8');
const playwrightConfig = await readFile('playwright.config.js', 'utf8');
const packageManifest = JSON.parse(await readFile('package.json', 'utf8'));
const requiredWorkflows = await Promise.all([
  readFile('.github/workflows/ci.yml', 'utf8'),
  readFile('.github/workflows/pages.yml', 'utf8'),
]);
assert.match(cleanVerifier, /waitForOwnedPreviewExit/);
assert.equal(packageManifest.scripts['measure:size'], 'node scripts/size-package.mjs');
assert.doesNotMatch(packageManifest.scripts['verify:clean'], /verify:size/);
for (const workflow of requiredWorkflows) assert.doesNotMatch(workflow, /verify:size|measure:size/);
for (const workflow of requiredWorkflows) {
  assert.ok((workflow.match(/pnpm build:fixtures/g) ?? []).length >= 2, 'each workflow prepares fixtures in verification and browser jobs');
  const buildIndex = workflow.indexOf('run: pnpm build:fixtures', workflow.indexOf('browsers:'));
  const rootPlaywrightIndex = workflow.indexOf('pnpm exec playwright test --project=${{ matrix.browser }}');
  assert.ok(buildIndex >= 0 && buildIndex < rootPlaywrightIndex, 'browser jobs build fixtures before root Playwright');
}
assert.match(requiredWorkflows[0], /release:local/);
assert.match(requiredWorkflows[0], /sha256sum -c SHA256SUMS/);
assert.match(requiredWorkflows[1], /release:local/);
assert.match(requiredWorkflows[1], /sha256sum -c SHA256SUMS/);
const currentDocs = await Promise.all([
  readFile('README.md', 'utf8'),
  readFile('decisions/ADR-006-size-package.md', 'utf8'),
  readFile('docs/getting-started-personal-use.md', 'utf8'),
  readFile('docs/local-release-workflow.md', 'utf8'),
  readFile('docs/status-and-support.md', 'utf8'),
]);
for (const doc of currentDocs) {
  assert.match(doc, /initial design evidence|initial evidence/i);
  assert.match(doc, /not required.*(browser|CI|build)|not.*(browser|CI|build).*required|without requiring.*(browser|CI|build)/i);
}
assert.match(currentDocs[0], /checksum.*(integrity|artifact)|integrity.*checksum/i);
assert.doesNotMatch(cleanVerifier, /verify:size/);
assert.match(await readFile('scripts/preview-process.mjs', 'utf8'), /PREVIEW_TEARDOWN_TIMEOUT/);
assert.match(playwrightConfig, /production-fixtures-server\.mjs 4174/);
assert.doesNotMatch(playwrightConfig, /verify:size/);
assert.match(playwrightConfig, /command: 'pnpm vite preview/);
assert.doesNotMatch(playwrightConfig, /command: 'pnpm build/);
assert.doesNotMatch(playwrightConfig, /build-consumer-fixture/);
assert.doesNotMatch(playwrightConfig, /command: '[^']*(?:build|&&)/);
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
const historicalViability = 'evidence/historical/personal-use-viability-and-expansion.md';
assert.equal((await stat(historicalViability)).isFile(), true);
const currentViability = 'docs/personal-use-viability-and-expansion.md';
assert.equal((await stat(currentViability)).isFile(), true);
const readmeText = await readFile('README.md', 'utf8');
assert.match(readmeText, /Personal-use viability and expansion.*docs\/personal-use-viability-and-expansion\.md/);
assert.match(readmeText, /Historical pre-migration viability assessment.*evidence\/historical\/personal-use-viability-and-expansion\.md/);
const currentRoots = ['README.md', 'docs', 'decisions', 'src', 'tests', 'fixtures', 'scripts', 'dist', 'evidence', 'tmp/remediation-size', 'package.json'];
const historicalPath = /(?:^|\/)evidence\/historical(?:\/|$)|(?:^|\/)decisions\/ADR-00[1-8]-/;
const legacyMarkers = /--_nb-|data-_nb-|neobrui\.recipes|src\/recipes/i;
const sizeOutput = 'tmp/remediation-size';
await buildSizeCandidate({ outputRoot: sizeOutput });
const currentFiles = [];
const LIMITS = { files: 5000, fileBytes: 1024 * 1024, archiveBytes: 16 * 1024 * 1024, archiveMembers: 2048, archiveMemberBytes: 1024 * 1024, archiveTextBytes: 32 * 1024 * 1024 };
async function collectCurrent(entry) {
  const info = await lstat(entry);
  if (info.isSymbolicLink()) throw new Error(`symlink is not allowed: ${entry}`);
  if (info.isDirectory()) {
    if (['node_modules', '.pnpm-store', '.astro', '.qa-rehearsal', '.evidence-cache', 'test-results'].includes(entry.split('/').at(-1))) return;
    for (const child of await readdir(entry)) await collectCurrent(`${entry}/${child}`);
  } else if (info.isFile()) {
    if (info.size > LIMITS.fileBytes) throw new Error(`file byte limit exceeded: ${entry}`);
    currentFiles.push(entry);
    if (currentFiles.length > LIMITS.files) throw new Error(`file count limit exceeded: ${LIMITS.files}`);
  }
}
for (const root of currentRoots) await collectCurrent(root);
const currentTestFiles = new Set(['tests/remediation.test.mjs', 'tests/cube-contract.test.mjs', 'tests/qa-rehearsal.test.mjs']);
function currentText(file, text) {
  if (historicalPath.test(file) || currentTestFiles.has(file)) return;
  const documentedMigration = file.endsWith('.md') ? text.split('\n').filter((line) => !(line.includes('→') || /historical|pre-migration|old evidence|prior evidence/i.test(line))).join('\n') : text;
  const actionable = file.endsWith('ADR-010-cube-migration-contract.md')
    ? documentedMigration.replace(/## Complete naming map[\s\S]*?## Stable selectors and attributes/, '## Stable selectors and attributes')
    : documentedMigration;
  assert.doesNotMatch(actionable, legacyMarkers, `legacy current contract in ${file}`);
}
async function archiveTextEntries(file) {
  assert.ok((await stat(file)).size <= LIMITS.archiveBytes, `archive byte limit exceeded: ${file}`);
  const entries = execFileSync('tar', ['-tzf', file], { encoding: 'utf8' }).split('\n').filter(Boolean);
  assert.ok(entries.length <= LIMITS.archiveMembers, `archive member limit exceeded: ${file}`);
  let extractedBytes = 0;
  return entries.filter(entry => {
    assert.ok(!entry.startsWith('/') && !entry.split('/').includes('..') && !entry.includes('\\'), `archive traversal member: ${entry}`);
    return !entry.endsWith('/');
  }).map(entry => {
    const text = execFileSync('tar', ['-xOf', file, entry], { encoding: 'utf8', maxBuffer: LIMITS.archiveMemberBytes });
    assert.ok(Buffer.byteLength(text) <= LIMITS.archiveMemberBytes, `archive member byte limit exceeded: ${entry}`);
    extractedBytes += Buffer.byteLength(text);
    assert.ok(extractedBytes <= LIMITS.archiveTextBytes, `archive text limit exceeded: ${file}`);
    return text;
  });
}
for (const file of currentFiles) {
  if (file.endsWith('.tgz')) {
    for (const text of await archiveTextEntries(file)) currentText(`${file} archive entry`, text);
  } else currentText(file, await readFile(file, 'utf8'));
}

// Regression proof: a marker in generated/package output must fail even when
// its line calls itself historical. This guards against the old line waiver.
const probeRoot = await mkdtemp('tmp/remediation-legacy-probe-');
const probeFile = `${probeRoot}/generated.css`;
await writeFile(probeFile, '/* historical evidence */ .nbr-button { --_nb-color: red; }\n');
assert.throws(() => currentText(probeFile, '/* historical evidence */ .nbr-button { --_nb-color: red; }'), /legacy current contract/);
await rm(probeRoot, { recursive: true, force: true });

// Every current Markdown link must resolve to a repository file or directory.
for (const file of currentFiles.filter(file => file.endsWith('.md') && !historicalPath.test(file))) {
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
