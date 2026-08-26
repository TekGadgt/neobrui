import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const cases = [
  ['normal', 'rgb(30, 64, 175)'],
  ['explicit', 'rgb(22, 101, 52)'],
];

test.describe('Spike 4 shared cascade matrix', () => {
  test('Tailwind utility and neobrui recipe resolve together in production output', async ({ page }) => {
    await page.goto('/tailwind/');
    const button = page.locator('button');
    await expect(button).toHaveCSS('background-color', 'rgb(22, 101, 52)');
    await expect(page.locator('body')).toHaveCSS('padding-top', '16px');
    await expect(page.locator('body')).toHaveCSS('padding-left', '16px');
    await expect(button).toHaveCSS('border-width', '2px');
  });

  for (const [name, color] of cases) {
    test(`${name} consumer contract`, async ({ page }) => {
      await page.goto('/coexistence/');
      const button = page.locator(`.${name} ._nb-spike-button`);
      await expect(button).toBeVisible();
      await expect(button).toHaveCSS('background-color', color);
    });
  }

  test('hostile high-specificity and important CSS visibly owns failure', async ({ page }) => {
    await page.goto('/coexistence/');
    const button = page.locator('.hostile ._nb-spike-button');
    await expect(button).toHaveCSS('background-color', 'rgb(185, 28, 28)');
    await expect(button).toHaveCSS('display', 'inline');
  });

  test('captures passing and expected-failure evidence only when explicitly requested', async ({ page, browserName }) => {
    await page.goto('/coexistence/');
    if (process.env.CAPTURE_EVIDENCE === '1') {
      await mkdir('.evidence-cache/screenshots', { recursive: true });
      await page.screenshot({ path: `.evidence-cache/screenshots/coexistence-matrix-${browserName}.png`, fullPage: true });
      await page.locator('.hostile').screenshot({ path: `.evidence-cache/screenshots/coexistence-hostile-${browserName}.png` });
    }
  });

  for (const direction of ['ltr', 'rtl']) {
    for (const width of [320, 1024]) {
      test(`${direction} ${width}px remains local and overflow-free`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/coexistence/');
        await page.locator('html').evaluate((el, dir) => { el.dir = dir; }, direction);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      });
    }
  }
});
