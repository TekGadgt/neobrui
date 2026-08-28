import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/principles/', '/foundations/', '/layout/', '/primitives/', '/patterns/', '/adoption/'];
const mounted = route => `${process.env.PUBLIC_SITE_BASE || '/'}${route.slice(1)}`;
for (const route of routes) {
  test(`route ${route} is a usable document`, async ({ page }) => {
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(mounted(route));
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
    const targets = await page.locator('a[href],img[src],script[src],link[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href') || node.getAttribute('src')).filter(Boolean));
    for (const target of new Set(targets)) {
      const resolved = new URL(target, page.url());
      if (resolved.origin !== new URL(page.url()).origin) continue;
      const mount = process.env.PUBLIC_SITE_BASE || '/';
      expect(resolved.pathname.startsWith(mount)).toBeTruthy();
      const targetResponse = await page.request.get(resolved.toString());
      expect(targetResponse.status(), target).toBeLessThan(400);
      if (resolved.hash) expect(await page.locator(resolved.hash).count(), target).toBeGreaterThan(0);
    }
  });
}

test('patterns representative gallery supports responsive interaction and accessibility', async ({ page }) => {
  await page.goto(mounted('/patterns/'));
  await expect(page.locator('h1')).toHaveText('Patterns');
  await expect(page.locator('.nbr-gallery > :first-child')).toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  await page.getByRole('link', { name: 'Read the case study' }).focus();
  await expect(page.getByRole('link', { name: 'Read the case study' })).toBeFocused();
  const results = await new AxeBuilder({ page }).include('main').exclude('pre').analyze();
  expect(results.violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('.nbr-gallery')).toBeVisible();
});

test('generated search, sitemap, and 404 boundaries are real', async ({ page, request }) => {
  await page.goto(mounted('/'));
  const root = new URL(process.env.PUBLIC_SITE_BASE || '/', page.url());
  for (const path of ['sitemap-index.xml', 'pagefind/pagefind.js', 'pagefind/pagefind-ui.js']) {
    expect((await request.get(new URL(path, root).toString())).status()).toBe(200);
  }
  const sitemap = await request.get(new URL('sitemap-index.xml', root).toString());
  const xml = await sitemap.text();
  for (const loc of [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])) {
    const parsed = new URL(loc);
    const localLoc = new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, page.url());
    expect((await request.get(localLoc.toString())).status()).toBe(200);
  }
  const missing = await request.get(new URL('404.html', root).toString());
  expect(missing.status()).toBe(200);
  expect(await missing.text()).toMatch(/404|Not Found/i);
});
