import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  foundations: await readFile(new URL('../src/foundations.css', import.meta.url), 'utf8'),
  layout: await readFile(new URL('../src/layout.css', import.meta.url), 'utf8'),
  primitives: await readFile(new URL('../src/primitives.css', import.meta.url), 'utf8'),
  utilities: await readFile(new URL('../src/utilities.css', import.meta.url), 'utf8'),
};
const docs = await Promise.all(['index', 'principles', 'foundations', 'layout', 'primitives', 'patterns', 'adoption'].map(async name => [name, await readFile(new URL(`../apps/docs/src/content/docs/${name}.mdx`, import.meta.url), 'utf8')]));
const pages = Object.fromEntries(docs);
const api = await readFile(new URL('../skills/neobrui/references/api.md', import.meta.url), 'utf8');

const classes = [...new Set(Object.values(files).flatMap(source => [...source.matchAll(/\.([a-z][\w-]+)/g)].map(match => `.${match[1]}`)))];
const variables = [...new Set(Object.values(files).flatMap(source => [...source.matchAll(/--nbr-[a-z0-9-]+/g)].map(match => match[0])))];
const attributes = [...new Set(Object.values(files).flatMap(source => [...source.matchAll(/data-nbr-[a-z-]+/g)].map(match => match[0])))];

const human = {
  '.nbr-stack': pages.layout, '.nbr-cluster': pages.layout, '.nbr-wrapper': pages.layout, '.nbr-grid': pages.layout,
  '.nbr-u-visually-hidden': pages.layout, '.nbr-surface': pages.primitives, '.nbr-pressable': pages.primitives,
};
for (const [name, content] of docs) test(`developer reference route ${name} has implementation content`, () => {
  assert.match(content, /^---[\s\S]+^title:/m);
  assert.match(content, /```(html|css|sh|js|json)/);
});

test('every public CSS class is documented for humans and AI lookup', () => {
  for (const name of classes) { assert.ok(human[name], `${name} needs a page mapping`); assert.match(human[name], new RegExp(name.replace('.', '\\.') + '\\b')); assert.match(api, new RegExp(name.replace('.', '\\.') + '\\b`')); }
});
test('every public custom property and data attribute is documented', () => {
  for (const variable of variables) { assert.match(pages.foundations + pages.layout + pages.primitives, new RegExp(variable.replaceAll('-', '\\-'))); assert.match(api, new RegExp(variable.replaceAll('-', '\\-'))); }
  for (const attribute of attributes) assert.match(pages.primitives + pages.layout, new RegExp(attribute));
});

test('source exports and seven routes stay explicit', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(packageJson.exports), ['.', './foundations.css', './layout.css', './primitives.css', './utilities.css', './package.json']);
  assert.deepEqual(Object.keys(pages), ['index', 'principles', 'foundations', 'layout', 'primitives', 'patterns', 'adoption']);
});
