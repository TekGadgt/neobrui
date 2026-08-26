import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
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
  assert.match(html, /data-_nb-theme=/, fixture);
  assert.doesNotMatch(html, /<script\b/i, fixture);
}

const boundaryFiles = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else boundaryFiles.push(file);
  }
}
for (const directory of ['src', 'scripts', 'fixtures', 'tests', 'evidence', 'decisions']) {
  await collect(directory);
}
const scannedFiles = boundaryFiles.filter(file => file !== 'tests/remediation.test.mjs');
const source = (await Promise.all(scannedFiles.map(file => readFile(file, 'utf8')))).join('\n');
assert.doesNotMatch(source, /(?:personal_site|htmlday-lite)/i);
assert.doesNotMatch(source, /\b(?:astro|react|storybook|tailwind)\b/i);
assert.doesNotMatch(source, /(?:editor|preview|creator|takeaway|portfolio|brand)\s*[:=]/i);
assert.doesNotMatch(source, /\.json\s*['"]?\s*[:=]/i);

console.log(`remediation tests: ${boundaryFiles.length} files, ${Object.keys(REQUIRED_ROLES).length} families`);
