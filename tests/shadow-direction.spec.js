import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

const shadow = locator => locator.evaluate(el => getComputedStyle(el).boxShadow);
const inlineOffset = value => Number(value.match(/(?:rgb\([^)]*\)|rgba\([^)]*\))\s*(-?\d+(?:\.\d+)?)px/)?.[1]);

test.describe('Spike 3 shadow direction policy', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/shadows/'); });

  test('logical LTR and RTL offsets are nonzero, with block positive', async ({ page }) => {
    const ltr = page.locator('#ltr-default .nbr-button');
    const rtl = page.locator('#rtl-default .nbr-button');
    expect(inlineOffset(await shadow(ltr))).toBe(3);
    expect(inlineOffset(await shadow(rtl))).toBe(-3);
    expect(await shadow(ltr)).toContain('4px');
    expect(await shadow(rtl)).toContain('4px');
  });

  test('nested direction follows nearest root and fixed policy stays down-right', async ({ page }) => {
    expect(inlineOffset(await shadow(page.locator('#nested-ltr-in-rtl .nbr-button')))).toBe(3);
    expect(inlineOffset(await shadow(page.locator('#nested-rtl-in-ltr .nbr-button')))).toBe(-3);
    expect(inlineOffset(await shadow(page.locator('#fixed-ltr .nbr-button')))).toBe(3);
    expect(inlineOffset(await shadow(page.locator('#fixed-rtl .nbr-button')))).toBe(3);
  });

  test('active translation matches collapsed shadow and dimensions remain stable', async ({ page }) => {
    const button = page.locator('#ltr-default .nbr-button');
    const before = await button.boundingBox();
    await button.hover();
    await page.mouse.down();
    const active = await button.boundingBox();
    expect(active.width).toBeCloseTo(before.width, 3);
    expect(active.height).toBeCloseTo(before.height, 3);
    await page.waitForTimeout(150);
    expect(await shadow(button)).toMatch(/1(?:\.\d+)?px/);
    expect(await button.evaluate(el => getComputedStyle(el).transform)).toMatch(/matrix\(1, 0, 0, 1, 2, 3\)/);
    await page.mouse.up();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });

  test('keyboard focus does not trigger pointer translation and remains visible at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 200 });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const button = page.locator('#ltr-default .nbr-button');
    await button.focus();
    expect(await button.evaluate(el => getComputedStyle(el).transform)).toBe('none');
    expect(await button.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });

  test('invalid shadow fixture field exposes visible correction text through aria-describedby', async ({ page }) => {
    const field = page.locator('#shadow-invalid');
    const describedBy = await field.getAttribute('aria-describedby');
    expect(describedBy).toBe('shadow-invalid-error');
    const correction = page.locator(`#${describedBy}`);
    await expect(correction).toBeVisible();
    await expect(correction).toContainText('Correction:');
    expect(await field.evaluate(el => getComputedStyle(el).borderStyle)).toBe('dashed');
  });

  test('shadow-disabled and forced-colors preserve non-shadow state cues', async ({ page, browserName }) => {
    const disabled = page.locator('#shadow-disabled');
    expect(await shadow(disabled.locator('.nbr-button').first())).toBe('none');
    expect(await disabled.locator('.nbr-button').nth(1).evaluate(el => getComputedStyle(el).opacity)).not.toBe('1');
    expect(await disabled.locator('#shadow-invalid').evaluate(el => getComputedStyle(el).borderStyle)).toBe('dashed');
    await page.emulateMedia({ forcedColors: 'active' });
    if (browserName === 'webkit') {
      expect(await page.evaluate(() => [...document.styleSheets].some(sheet => { try { return [...sheet.cssRules].some(rule => rule.cssText.includes('forced-colors')); } catch { return false; } }))).toBe(true);
    } else {
      expect(await page.locator('#ltr-default .nbr-button').evaluate(el => getComputedStyle(el).boxShadow)).toBe('none');
    }
    await page.locator('#ltr-default .nbr-button').focus();
    expect(await page.locator('#ltr-default .nbr-button').evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  });

  test('has no axe violations and loads without external requests', async ({ page }) => {
    const requests = [];
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) requests.push(request.url()); });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(requests).toEqual([]);
  });

  test('captures compact policy evidence only when explicitly requested', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 640, height: 480 });
    if (process.env.CAPTURE_EVIDENCE === '1') {
      await mkdir('.evidence-cache/screenshots', { recursive: true });
      for (const [name, selector] of [['ltr', '#ltr-default'], ['rtl', '#rtl-default'], ['fixed', '#fixed-rtl'], ['disabled', '#shadow-disabled']]) {
        await page.locator(selector).screenshot({ path: `.evidence-cache/screenshots/shadows-${browserName}-${name}.png` });
      }
    }
  });
});
