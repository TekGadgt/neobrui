import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Spike 2 recipes', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/recipes/'); });

  test('has native names and keyboard order', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Surface, Button, and Field recipes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Native button' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Native link' })).toHaveAttribute('href', '#field');
    await expect(page.locator('label[for="recipe-email"]')).toBeVisible();
    await expect(page.locator('#recipe-email')).toHaveAttribute('aria-describedby', /recipe-email-description/);
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveClass(/_nb-spike-button/);
  });

  test('distinguishes surface hierarchy and keeps at least half quiet', async ({ page }) => {
    await expect(page.locator('._nb-spike-surface[data-_nb-level="quiet"]')).toHaveCount(1);
    await expect(page.locator('._nb-spike-surface[data-_nb-level="outlined"]')).toHaveCount(1);
    await expect(page.locator('._nb-spike-surface[data-_nb-level="raised"]')).toHaveCount(1);
    const quiet = await page.locator('._nb-spike-surface[data-_nb-level="quiet"]').count();
    const lowNoise = await page.locator('._nb-spike-surface:not([data-_nb-level="raised"])').count();
    expect(lowNoise).toBeGreaterThanOrEqual(quiet * 2);
  });

  test('button press has stable geometry and field invalid contract', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Native button' });
    const before = await button.boundingBox();
    await button.hover();
    await page.mouse.down();
    const during = await button.boundingBox();
    await page.mouse.up();
    expect(during).toMatchObject({ width: before.width, height: before.height });
    expect(await page.locator('#recipe-email').getAttribute('aria-invalid')).toBe('true');
    await expect(page.locator('#recipe-email-error')).toBeVisible();
    await expect(page.locator('#recipe-disabled')).toBeDisabled();
  });

  test('custom-property override applies without selector override', async ({ page }) => {
    const raised = page.locator('._nb-spike-surface[data-_nb-level="raised"]');
    await expect(raised).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(raised).toHaveCSS('color', 'rgb(23, 21, 18)');
  });

  test('fits at 320px with no horizontal overflow and no external requests', async ({ page }) => {
    const external = [];
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url()); });
    await page.setViewportSize({ width: 320, height: 900 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(external).toEqual([]);
  });

  test('works without JavaScript and passes axe', async ({ browser, page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    const context = await browser.newContext({ javaScriptEnabled: false });
    const noJs = await context.newPage();
    await noJs.goto('http://127.0.0.1:4173/recipes/');
    await expect(noJs.getByRole('heading', { name: 'Surface, Button, and Field recipes' })).toBeVisible();
    await context.close();
  });
});
