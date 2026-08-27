import { test, expect } from '@playwright/test';

const routes = ['/', '/principles/', '/foundations/', '/layout/', '/primitives/', '/patterns/', '/adoption/'];
const basePath = process.env.PUBLIC_SITE_BASE || '/';
const sitePath = (route) => `${basePath === '/' ? '' : basePath.replace(/\/$/, '')}${route}`;

for (const route of routes) {
  test(`renders mobile menu on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(sitePath(route));
    const menu = page.getByRole('button', { name: 'Menu' });
    const menuToggle = page.locator('starlight-menu-button');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#starlight__sidebar')).toBeVisible();
    await expect(page.locator('#starlight__sidebar a').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
  });
}

test('examples links resolve to rendered anchors', async ({ page }) => {
  await page.goto(sitePath('/patterns/'));
  const hrefs = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  for (const href of hrefs) await expect(page.locator(href)).toHaveCount(1);
});

test('mobile menu supports keyboard activation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(sitePath('/patterns/'));
  const menu = page.getByRole('button', { name: 'Menu' });
  const menuToggle = page.locator('starlight-menu-button');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await page.keyboard.press(' ');
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
});