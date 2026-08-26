import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('neutral CUBE onboarding site', () => {
  test('is semantic, CSS-only, local, and responsive', async ({ page }) => {
    const requests = [];
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1')) requests.push(request.url()); });
    await page.goto('/neutral-site/');
    await expect(page.getByRole('heading', { name: 'Neutral CUBE fixture' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Primary action' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    const evidence = await page.evaluate(() => {
      const stack = document.querySelector('main');
      const cluster = document.querySelector('.nbr-cluster');
      return {
        stackDisplay: getComputedStyle(stack).display,
        stackDirection: getComputedStyle(stack).flexDirection,
        clusterWrap: getComputedStyle(cluster).flexWrap,
        clusterDirection: getComputedStyle(cluster).direction,
        scripts: document.scripts.length,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    expect(evidence).toEqual({ stackDisplay: 'flex', stackDirection: 'column', clusterWrap: 'wrap', clusterDirection: 'rtl', scripts: 0, overflow: false });
    expect(requests).toEqual([]);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });

  test('remains available without JavaScript at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/neutral-site/');
    await expect(page.getByRole('heading', { name: 'Neutral CUBE fixture' })).toBeVisible();
    await page.locator('#email').focus();
    await expect(page.locator('#email')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });

  test('proves nested compositions, vertical writing, and long-content reflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/neutral-site/');
    const evidence = await page.evaluate(() => {
      const nestedCluster = document.querySelector('#nested-cluster');
      const nestedStack = document.querySelector('#nested-stack');
      const vertical = document.querySelector('[style*="writing-mode"]');
      const longContent = document.querySelector('.fixture-long-content');
      return {
        clusterDisplay: getComputedStyle(nestedCluster).display,
        stackDisplay: getComputedStyle(nestedStack).display,
        writingMode: getComputedStyle(vertical).writingMode,
        longContentFits: longContent.scrollWidth <= longContent.clientWidth,
        pageFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      };
    });
    expect(evidence).toEqual({ clusterDisplay: 'flex', stackDisplay: 'flex', writingMode: 'vertical-rl', longContentFits: true, pageFits: true });
  });
});
