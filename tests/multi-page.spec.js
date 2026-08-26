import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const fixtures = [
  ['personal-light', 'Personal light', 'personal-light'],
  ['personal-dark', 'Personal dark', 'personal-dark'],
  ['workshop', 'Workshop', 'workshop'],
  ['nested-theme', 'Nested theme', 'nested-theme'],
  ['neutralized', 'Neutralized', 'neutralized'],
];

test.describe('isolated fixture delivery', () => {
  for (const [route, heading, theme] of fixtures) {
    test(`${route} serves its own built page and local CSS`, async ({ page }) => {
      const response = await page.goto(`/${route}/`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(`${heading} fixture`);
      await expect(page.locator('html')).toHaveAttribute('data-_nb-theme', theme);
      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
      await expect(page.locator('main')).not.toContainText('Plain fixture');
      await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(2);
      await expect(page.locator('link[rel="stylesheet"]').nth(0)).toHaveAttribute('href', /assets\//);
      expect(await page.locator('link[rel="stylesheet"]').evaluateAll(links => links.every(link => link.sheet !== null))).toBe(true);
    });
  }

  test('production output contains every isolated HTML entry', async () => {
    for (const [route, heading, theme] of fixtures) {
      const html = await fs.readFile(path.join(root, 'dist', route, 'index.html'), 'utf8');
      expect(html).toContain(`<title>${heading} fixture</title>`);
      expect(html).toContain(`data-_nb-theme="${theme}"`);
      expect(html).not.toContain('Plain fixture');
    }
  });
});
