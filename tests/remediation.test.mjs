import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import packageJson from '../package.json' with { type: 'json' };
import path from 'node:path';
import { generateCss } from '../src/tokens/tokens.mjs';
import { themes } from '../fixtures/inputs.mjs';
import { REQUIRED_ROLES, validateTokens } from '../src/tokens/schema.mjs';

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

// Spike 4 reproducibility contracts: these checks intentionally fail until the
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

console.log(`remediation tests: ${boundaryFiles.length} files, ${Object.keys(REQUIRED_ROLES).length} families`);
