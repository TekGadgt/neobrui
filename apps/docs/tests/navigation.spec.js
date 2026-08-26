import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/getting-started/', '/foundations/', '/compositions/', '/utilities/', '/blocks/', '/examples/', '/accessibility/', '/release/', '/future/'];
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
  await page.goto(sitePath('/examples/'));
  const hrefs = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  for (const href of hrefs) await expect(page.locator(href)).toHaveCount(1);
});

test('mobile menu supports keyboard activation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(sitePath('/examples/'));
  const menu = page.getByRole('button', { name: 'Menu' });
  const menuToggle = page.locator('starlight-menu-button');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await page.keyboard.press(' ');
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
});

test('search remains interactive and restores focus after closing', async ({ page }) => {
  await page.goto(sitePath('/examples/'));
  const openSearch = page.getByRole('button', { name: 'Search' });
  await expect(page.locator('[data-pagefind-search-wrapper]')).toHaveCount(1);
  await expect(page.locator('[data-pagefind-search-wrapper] site-search')).toHaveCount(1);
  await openSearch.click();
  const dialog = page.getByRole('dialog');
  const searchInput = page.locator('.pagefind-ui__search-input');
  await expect(dialog).toBeVisible();
  await searchInput.fill('button');
  await expect(page.locator('.pagefind-ui__result').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(openSearch).toBeFocused();
});

test('responsive TOC exposes only the active navigation landmark', async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 800, name: 'desktop' }, { width: 320, height: 800, name: 'mobile' }]) {
    await page.setViewportSize(viewport);
    await page.goto(sitePath('/examples/'));
    const landmarks = page.getByRole('navigation', { name: 'On this page' });
    const mobileLandmark = page.locator('mobile-starlight-toc > nav');
    const desktopLandmark = page.locator('.right-sidebar-panel nav');
    await expect(landmarks, `${viewport.name} visible TOC landmark count`).toHaveCount(1);
    const displays = await page.evaluate(() => ({
      mobile: {
        display: getComputedStyle(document.querySelector('mobile-starlight-toc > nav')).display,
        visible: document.querySelector('mobile-starlight-toc > nav').checkVisibility(),
      },
      desktop: {
        display: getComputedStyle(document.querySelector('.right-sidebar-panel nav')).display,
        visible: document.querySelector('.right-sidebar-panel nav').checkVisibility(),
      },
    }));
    if (viewport.name === 'mobile') {
      await expect(mobileLandmark, `${viewport.name} mobile TOC visibility`).toBeVisible();
      await expect(desktopLandmark, `${viewport.name} desktop TOC visibility`).toBeHidden();
      expect(displays.mobile.display, `${viewport.name} mobile TOC computed display`).not.toBe('none');
      expect(displays.mobile.visible, `${viewport.name} mobile TOC effective visibility`).toBe(true);
      expect(displays.desktop.display, `${viewport.name} desktop TOC computed display`).toBe('block');
      expect(displays.desktop.visible, `${viewport.name} desktop TOC effective visibility`).toBe(false);
    } else {
      await expect(mobileLandmark, `${viewport.name} mobile TOC visibility`).toBeHidden();
      await expect(desktopLandmark, `${viewport.name} desktop TOC visibility`).toBeVisible();
      expect(displays.mobile.display, `${viewport.name} mobile TOC computed display`).toBe('block');
      expect(displays.mobile.visible, `${viewport.name} mobile TOC effective visibility`).toBe(false);
      expect(displays.desktop.display, `${viewport.name} desktop TOC computed display`).not.toBe('none');
      expect(displays.desktop.visible, `${viewport.name} desktop TOC effective visibility`).toBe(true);
    }
  }
});

test('interactive docs states have no axe violations', async ({ page }) => {
  const states = [
    { route: '/', name: 'home' },
    { route: '/examples/', name: 'examples' },
  ];
  for (const state of states) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(sitePath(state.route));
    const desktopResults = await new AxeBuilder({ page }).analyze();
    expect(desktopResults.violations, `${state.name}: ${desktopResults.violations.map(({ id }) => id).join(', ')}`).toEqual([]);

    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(sitePath(state.route));
    await page.getByRole('button', { name: 'Menu' }).click();
    const menuResults = await new AxeBuilder({ page }).analyze();
    expect(menuResults.violations, `${state.name} mobile menu: ${menuResults.violations.map(({ id }) => id).join(', ')}`).toEqual([]);

    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(sitePath(state.route));
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const searchInput = page.locator('.pagefind-ui__search-input');
    await expect(searchInput).toHaveAttribute('aria-label', 'Search');
    await expect(searchInput).toHaveAttribute('placeholder', 'Search');
    await expect(searchInput).toHaveCount(1);
    const searchResults = await new AxeBuilder({ page }).analyze();
    expect(searchResults.violations, `${state.name} search: ${searchResults.violations.map(({ id }) => id).join(', ')}`).toEqual([]);
  }
});
