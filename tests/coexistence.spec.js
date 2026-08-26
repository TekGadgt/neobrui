import { test, expect } from '@playwright/test';

const cases = [
  ['normal', 'rgb(30, 64, 175)'],
  ['explicit', 'rgb(22, 101, 52)'],
];

test.describe('Spike 4 shared cascade matrix', () => {
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

  test('captures passing and expected-failure evidence', async ({ page }) => {
    await page.goto('/coexistence/');
    await page.screenshot({ path: 'evidence/screenshots/coexistence-matrix-chromium.png', fullPage: true });
    await page.locator('.hostile').screenshot({ path: 'evidence/screenshots/coexistence-hostile-chromium.png' });
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
