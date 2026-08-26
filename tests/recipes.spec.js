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

  test('raised surface and button use a nonzero inline hard-shadow offset', async ({ page }) => {
    const raised = page.locator('._nb-spike-surface[data-_nb-level="raised"]');
    const button = page.getByRole('button', { name: 'Native button' });
    expect(await raised.evaluate(el => getComputedStyle(el).boxShadow)).toMatch(/3px/);
    expect(await button.evaluate(el => getComputedStyle(el).boxShadow)).toMatch(/3px/);
  });

  test('button press has stable geometry and field invalid contract', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Native button' });
    const before = await button.boundingBox();
    await button.hover();
    await page.mouse.down();
    const during = await button.boundingBox();
    await page.mouse.up();
    expect(during.width).toBeCloseTo(before.width, 3);
    expect(during.height).toBeCloseTo(before.height, 3);
    expect(await page.locator('#recipe-email').getAttribute('aria-invalid')).toBe('true');
    await expect(page.locator('#recipe-email-error')).toBeVisible();
    await expect(page.locator('#recipe-disabled')).toBeDisabled();
  });

  test('documented fixture theme boundary remaps consumed recipe hooks', async ({ page }) => {
    const boundary = page.locator('[data-_nb-fixture-theme="overrides"]');
    await expect(boundary).toHaveCount(1);
    await expect(boundary.locator('._nb-spike-surface[data-_nb-level="outlined"]')).toHaveCSS('background-color', 'rgb(239, 246, 255)');
    await expect(boundary.locator('._nb-spike-button').first()).toHaveCSS('background-color', 'rgb(124, 45, 18)');
    await expect(boundary.locator('._nb-spike-field input').first()).toHaveCSS('background-color', 'rgb(255, 247, 237)');
    await expect(boundary.locator('._nb-spike-surface[data-_nb-level="outlined"]')).toHaveCSS('border-top-color', 'rgb(30, 64, 175)');
  });

  test('200% text resize keeps content and controls available without overflow', async ({ page }) => {
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    for (const locator of [page.getByRole('button', { name: 'Native button' }), page.locator('#recipe-email'), page.locator('#recipe-disabled')]) {
      await expect(locator).toBeVisible();
      const box = await locator.boundingBox();
      expect(box.x + box.width).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
    }
  });

  test('reduced motion removes transitions while retaining the active cue', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const button = page.getByRole('button', { name: 'Native button' });
    expect(await button.evaluate(el => getComputedStyle(el).transitionDuration)).toMatch(/0s|0ms/);
    const restingShadow = await button.evaluate(el => getComputedStyle(el).boxShadow);
    await button.hover();
    await page.mouse.down();
    const activeShadow = await button.evaluate(el => getComputedStyle(el).boxShadow);
    await page.mouse.up();
    expect(activeShadow).not.toBe(restingShadow);
    expect(await button.evaluate(el => getComputedStyle(el).transform)).toBe('none');
  });

  test('forced colors suppresses shadows and preserves non-color state cues', async ({ page, browserName }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    const button = page.getByRole('button', { name: 'Native button' });
    const raised = page.locator('._nb-spike-surface[data-_nb-level="raised"]');
    if (browserName === 'webkit') {
      expect(await page.locator('link[href*="fixture"]').count()).toBe(1);
      expect(await page.evaluate(async () => (await fetch(document.querySelector('link[href*="fixture"]').href)).text()).then(css => css.includes('@media(forced-colors:active)'))).toBe(true);
    } else {
      expect(await button.evaluate(el => getComputedStyle(el).boxShadow)).toBe('none');
      expect(await raised.evaluate(el => getComputedStyle(el).boxShadow)).toBe('none');
    }
    await button.focus();
    expect(await button.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
    expect(await page.locator('#recipe-disabled').evaluate(el => getComputedStyle(el).opacity)).not.toBe('1');
    expect(await page.locator('#recipe-email').evaluate(el => getComputedStyle(el).borderStyle)).toBe('dashed');
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
