import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/principles/', '/foundations/', '/layout/', '/primitives/', '/patterns/', '/adoption/'];
for (const route of routes) {
  test(`route ${route} is a usable document`, async ({ page }) => {
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
    for (const href of await page.locator('a[href]').evaluateAll(as => as.map(a => a.getAttribute('href')).filter(h => h?.startsWith('/')))) {
      expect(href.startsWith('/') || href.startsWith('/neobrui/')).toBeTruthy();
    }
  });
}

test('patterns representative gallery supports responsive interaction and accessibility', async ({ page }) => {
  await page.goto('/patterns/');
  await expect(page.locator('h1')).toHaveText('Patterns');
  await expect(page.locator('.nbr-gallery > :first-child')).toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  await page.getByRole('link', { name: 'Read the case study' }).focus();
  await expect(page.getByRole('link', { name: 'Read the case study' })).toBeFocused();
  const results = await new AxeBuilder({ page }).include('main').analyze();
  expect(results.violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('.nbr-gallery')).toBeVisible();
});
