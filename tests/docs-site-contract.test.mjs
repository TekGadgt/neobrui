import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docs = resolve(root, 'apps/docs');

async function text(path) { return readFile(resolve(root, path), 'utf8'); }

test('docs app consumes only the prepared release artifact without source imports', async () => {
  const manifest = JSON.parse(await text('apps/docs/package.json'));
  assert.equal(manifest.dependencies, undefined);
  const config = await text('apps/docs/astro.config.mjs');
  assert.match(config, /\.generated\/neobrui/);
  assert.match(config, /neobrui\/tokens/);
  assert.doesNotMatch(config, /\.\.\/\.\.\/src\//);
});

test('docs app pins Starlight and Astro and supports configurable project base', async () => {
  const manifest = JSON.parse(await text('apps/docs/package.json'));
  const rootManifest = JSON.parse(await text('package.json'));
  assert.equal(rootManifest.devDependencies['@astrojs/starlight'], '0.41.9');
  assert.equal(rootManifest.devDependencies.astro, '7.2.7');
  const config = await text('apps/docs/astro.config.mjs');
  assert.match(config, /PUBLIC_SITE_BASE/);
  assert.match(config, /PUBLIC_SITE_URL/);
  assert.match(manifest.scripts['preview:pages'], /PUBLIC_SITE_BASE=\/neobrui\//);
  assert.match(rootManifest.scripts['preview:docs:pages'], /build:docs:pages/);
  assert.match(rootManifest.scripts['preview:docs:pages'], /astro preview --root apps\/docs/);
  const readme = await text('apps/docs/README.md');
  assert.match(readme, /build and preview commands must use the same `PUBLIC_SITE_BASE`/);
  assert.match(readme, /http:\/\/localhost:4321\/neobrui\//);
});

test('root owns docs tooling and the docs app has no nested install policy', async () => {
  const manifest = JSON.parse(await text('apps/docs/package.json'));
  const rootManifest = JSON.parse(await text('package.json'));
  assert.equal(manifest.dependencies, undefined);
  assert.equal(rootManifest.devDependencies['@axe-core/playwright'], '4.13.0');
  assert.equal(rootManifest.devDependencies['@playwright/test'], '1.62.1');
  assert.equal(rootManifest.devDependencies.typescript, '5.9.3');
  await assert.rejects(readdir(resolve(docs, 'node_modules')), /ENOENT/);
});

test('docs information architecture is represented in content routes', async () => {
  const routes = [
    'index.mdx', 'getting-started/index.mdx', 'foundations/index.mdx',
    'compositions/index.mdx', 'utilities/index.mdx', 'blocks/index.mdx',
    'examples/index.mdx', 'accessibility/index.mdx', 'release/index.mdx', 'future/index.mdx',
  ];
  for (const route of routes) await text(`apps/docs/src/content/docs/${route}`);
  const config = await text('apps/docs/astro.config.mjs');
  assert.match(config, /customCss/);
});

test('no active GitHub deployment workflow is present', async () => {
  await assert.rejects(readdir(resolve(root, '.github/workflows')));
});
