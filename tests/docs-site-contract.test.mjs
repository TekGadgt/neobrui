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

test('GitHub workflows are present with separate CI and Pages deployment jobs', async () => {
  const workflows = await readdir(resolve(root, '.github/workflows'));
  assert.deepEqual(workflows.sort(), ['ci.yml', 'pages.yml']);
  const ci = await text('.github/workflows/ci.yml');
  const pages = await text('.github/workflows/pages.yml');
  assert.match(ci, /pull_request/);
  assert.match(ci, /playwright test --project=\$\{\{ matrix\.browser \}\}/);
  const verify = pages.slice(pages.indexOf('  verify:'), pages.indexOf('  deploy:'));
  const deploy = pages.slice(pages.indexOf('  deploy:'));
  assert.match(verify, /actions\/configure-pages@v6/);
  assert.match(verify, /actions\/upload-pages-artifact@v5/);
  assert.match(pages, /actions\/deploy-pages@v5/);
  assert.match(verify, /path: apps\/docs\/dist/);
  assert.match(verify, /verify:pages[\s\S]*upload-pages-artifact/);
  assert.match(deploy, /needs: verify/);
  assert.doesNotMatch(deploy, /actions\/(?:checkout|upload-pages-artifact|configure-pages)|pnpm (?:install|build|run build)/);
});

test('Pages workflow contract keeps triggers and permissions least-privilege', async () => {
  const pages = await text('.github/workflows/pages.yml');
  assert.match(pages, /push:\s*\n\s+branches: \[main\]/);
  assert.match(pages, /workflow_dispatch:/);
  assert.match(pages, /permissions:\s*\n\s+contents: read/);
  assert.match(pages, /deploy:\s*[\s\S]*permissions:\s*\n\s+contents: read\s*\n\s+pages: write\s*\n\s+id-token: write/);
  assert.doesNotMatch(pages, /npm token|NPM_TOKEN|secrets\./i);
});

test('Pages-facing URLs use the canonical project URL', async () => {
  const files = ['README.md', 'apps/docs/package.json', 'apps/docs/README.md', 'package.json', '.github/workflows/pages.yml', 'docs/github-pages.md'];
  for (const file of files) {
    const content = await text(file);
    assert.doesNotMatch(content, /example\.invalid/);
  }
  const rootManifest = JSON.parse(await text('package.json'));
  const docsManifest = JSON.parse(await text('apps/docs/package.json'));
  assert.match(rootManifest.scripts['build:docs:pages'], /https:\/\/tekgadgt\.github\.io\/neobrui\//);
  assert.match(docsManifest.scripts['preview:pages'], /https:\/\/tekgadgt\.github\.io\/neobrui\//);
});
