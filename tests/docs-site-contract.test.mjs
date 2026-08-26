import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docs = resolve(root, 'apps/docs');

async function text(path) { return readFile(resolve(root, path), 'utf8'); }

test('docs app consumes the exact local release archive without source imports', async () => {
  const manifest = JSON.parse(await text('apps/docs/package.json'));
  assert.equal(manifest.dependencies.neobrui, 'file:../../dist/release/neobrui-0.1.0-alpha.0.tgz');
  const config = await text('apps/docs/astro.config.mjs');
  assert.doesNotMatch(config, /\.\.\/\.\.\/src\//);
});

test('docs app pins Starlight and Astro and supports configurable project base', async () => {
  const manifest = JSON.parse(await text('apps/docs/package.json'));
  assert.equal(manifest.dependencies['@astrojs/starlight'], '0.41.9');
  assert.equal(manifest.dependencies.astro, '7.2.7');
  const config = await text('apps/docs/astro.config.mjs');
  assert.match(config, /PUBLIC_SITE_BASE/);
  assert.match(config, /PUBLIC_SITE_URL/);
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
