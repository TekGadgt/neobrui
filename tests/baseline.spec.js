import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

test('plain fixture exposes semantic heading and content', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Plain fixture', level: 1 })).toBeVisible();
  await expect(page.getByText('meaningful without JavaScript or a network connection')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'CUBE baseline harness', level: 2 })).toBeVisible();
});

test('plain fixture remains usable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Plain fixture' })).toBeVisible();
  await expect(page.locator('main')).toContainText('neutral semantic baseline');
  await context.close();
});

test('fixture makes no external network requests', async ({ page }) => {
  const external = [];
  page.on('request', request => {
    if (!['http://127.0.0.1:4173', 'http://localhost:4173'].some(origin => request.url().startsWith(origin))) external.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  expect(external).toEqual([]);
});

test('repository metadata and references satisfy baseline boundaries', async () => {
  const packageJson = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  expect(packageJson.private).toBe(true);
  expect(packageJson.publishConfig).toEqual({ access: 'public', registry: 'https://registry.npmjs.org/' });
  const source = await fs.readFile(path.join(root, 'fixtures/plain/index.html'), 'utf8');
  expect(source).toContain('nbr');
  await expect(fs.readFile(path.join(root, 'README.md'), 'utf8')).resolves.toContain('read-only evidence');
});

test('repository portability contract keeps host and container dependencies separate', async () => {
  const workspace = await fs.readFile(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
  const readme = await fs.readFile(path.join(root, 'README.md'), 'utf8');
  expect(workspace).toContain('supportedArchitectures:');
  expect(workspace).toContain('os: [darwin, linux]');
  expect(workspace).toContain('cpu: [arm64, x64]');
  expect(readme).toMatch(/container.*Linux.*node_modules.*volume/i);
  expect(readme).toMatch(/host.*dependenc(?:y|ies).*separate/i);
  expect(readme).toMatch(/architecture matrix.*shared lockfile/i);
});
