import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const out = join(process.cwd(), 'evidence/screenshots');
const cases = [['neutral', 'light'], ['neutral', 'dark'], ['product', 'light'], ['product', 'dark']];
for (const [identity, theme] of cases) for (const [label, width] of [['desktop', 1280], ['mobile', 320]]) {
  test(`${identity} ${label} ${theme} capture`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: theme });
    const bad = [];
    page.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
    const response = await page.goto('/patterns/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Patterns', level: 1 })).toBeVisible();
    await expect(page.locator(`[data-specimen="${identity}"]`)).toBeVisible();
    expect(bad).toEqual([]);
    mkdirSync(out, { recursive: true });
    const file = join(out, `${identity}-${label}-${theme}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const manifest = join(out, 'manifest.json');
    let list = [];
    try { list = JSON.parse(readFileSync(manifest, 'utf8')); } catch { /* first capture */ }
    list.push({ identity, theme, viewport: { width, height: 900 }, route: '/patterns/', h1: 'Patterns', file: `screenshots/${identity}-${label}-${theme}.png`, sha256: createHash('sha256').update(readFileSync(file)).digest('hex'), dimensions: { width, height: await page.evaluate(() => document.documentElement.scrollHeight) } });
    writeFileSync(manifest, JSON.stringify(list, null, 2) + '\n');
  });
}