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

test('horizontally scrollable code regions are keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(sitePath('/getting-started/'));
  const codeRegions = page.locator('pre[data-language]');
  await expect(codeRegions).not.toHaveCount(0);
  for (const codeRegion of await codeRegions.all()) {
    await expect(codeRegion).toHaveAttribute('tabindex', '0');
    const overflow = await codeRegion.evaluate((element) => {
      element.style.width = '160px';
      element.style.overflowX = 'auto';
      return element.scrollWidth > element.clientWidth;
    });
    if (overflow) {
      await codeRegion.focus();
      const before = await codeRegion.evaluate((element) => element.scrollLeft);
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => codeRegion.evaluate((element) => element.scrollLeft)).toBeGreaterThan(before);
      await expect(codeRegion).toBeFocused();
    }
  }
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

const docsRoutes = routes;
const contrast = (foreground, background) => {
  const channel = (value) => {
    const c = Number.parseInt(value, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const rgb = (value) => [value.slice(1, 3), value.slice(3, 5), value.slice(5, 7)].map(channel);
  const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const first = luminance(rgb(foreground));
  const second = luminance(rgb(background));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

const cssColor = (value) => {
  const channels = value.startsWith('rgb') ? value.slice(value.indexOf('(') + 1, value.lastIndexOf(')')).split(',').slice(0, 3).map((channel) => Number.parseInt(channel, 10)) : null;
  if (channels) return channels;
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((offset) => Number.parseInt(hex[1].slice(offset, offset + 2), 16));
  throw new Error(`Unsupported CSS color: ${value}`);
};

const contrastFromCss = (foreground, background) => {
  const toHex = (channels) => `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
  return contrast(toHex(cssColor(foreground)), toHex(cssColor(background)));
};

const controlBoundarySelectors = [
  'starlight-theme-select select',
  'starlight-menu-button button',
];

test.describe('docs theme contrast matrix', () => {
  for (const theme of ['light', 'dark']) {
    test(`${theme} renders every route with passing core token pairs`, async ({ page }) => {
      for (const route of docsRoutes) {
        await page.goto(sitePath(route));
        await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
        const tokens = await page.evaluate(() => {
          const styles = getComputedStyle(document.documentElement);
          return {
            text: styles.getPropertyValue('--sl-color-text').trim(),
            muted: styles.getPropertyValue('--sl-color-gray-2').trim(),
            accent: styles.getPropertyValue('--sl-color-accent').trim(),
            background: styles.getPropertyValue('--sl-color-bg').trim(),
            border: styles.getPropertyValue('--sl-color-hairline').trim(),
          };
        });
        expect(tokens, route).toEqual(expect.objectContaining({ text: expect.stringMatching(/^#[0-9a-f]{6}$/i), background: expect.stringMatching(/^#[0-9a-f]{6}$/i) }));
        expect(contrast(tokens.text, tokens.background), `${theme} ${route} body`).toBeGreaterThanOrEqual(7);
        expect(contrast(tokens.muted, tokens.background), `${theme} ${route} muted`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(tokens.accent, tokens.background), `${theme} ${route} accent`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(tokens.border, tokens.background), `${theme} ${route} boundary`).toBeGreaterThanOrEqual(3);
      }
    });
  }
});

test.describe('docs control boundary contrast', () => {
  for (const theme of ['light', 'dark']) {
    test(`${theme} controls keep a 3:1 boundary on page and sidebar`, async ({ page }) => {
      for (const viewport of [{ width: 1280, height: 800 }, { width: 320, height: 800 }]) {
        await page.setViewportSize(viewport);
        await page.goto(sitePath('/examples/'));
        await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
        const controls = await page.evaluate((selectors) => {
          const styles = getComputedStyle(document.documentElement);
          const pageBackground = getComputedStyle(document.body).backgroundColor;
          const sidebarElement = document.querySelector('#starlight__sidebar');
          const sidebarBackground = sidebarElement ? getComputedStyle(sidebarElement).backgroundColor : pageBackground;
          const backgrounds = { page: pageBackground, sidebar: sidebarBackground };
          return selectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((element) => {
            const control = getComputedStyle(element);
            return { selector, border: control.borderTopColor || styles.getPropertyValue('--sl-color-hairline-light').trim() || styles.getPropertyValue('--sl-color-gray-5').trim(), backgrounds };
          }));
        }, controlBoundarySelectors);
        expect(controls.length, `${theme} ${viewport.width}px representative controls`).toBeGreaterThanOrEqual(3);
        for (const control of controls) {
          for (const [surface, background] of Object.entries(control.backgrounds)) {
            expect(contrastFromCss(control.border, background), `${theme} ${viewport.width}px ${control.selector} on ${surface}`).toBeGreaterThanOrEqual(3);
          }
        }
        if (viewport.width === 320) {
          const menu = page.getByRole('button', { name: 'Menu' });
          await menu.hover();
          await menu.focus();
          await menu.click();
          await expect(page.locator('#starlight__sidebar')).toBeVisible();
        }
      }
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(sitePath('/examples/'));
      await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
      await page.getByRole('button', { name: 'Search' }).click();
      const searchInput = page.locator('.pagefind-ui__search-input');
      await expect(searchInput).toBeVisible();
      const inputBoundary = await searchInput.evaluate((element) => {
        const style = getComputedStyle(element);
        return { border: style.borderTopColor, page: getComputedStyle(document.body).backgroundColor };
      });
      expect(contrastFromCss(inputBoundary.border, inputBoundary.page), `${theme} search dialog input`).toBeGreaterThanOrEqual(3);
    });
  }
});

test.describe('static code block accessibility', () => {
  for (const theme of ['light', 'dark']) {
    for (const route of routes) {
      test(`${theme} ${route} has no axe violations`, async ({ page }) => {
        await page.goto(sitePath(route));
        await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations, `${theme} ${route}: ${results.violations.map(({ id }) => id).join(', ')}`).toEqual([]);
      });
    }
  }
});

test('showcase primitives are package-owned and remain usable at narrow RTL sizes', async ({ page }) => {
  const expectations = [
    { route: '/', selector: '.nbr-surface' },
    { route: '/foundations/', selector: '.token-swatch' },
    { route: '/compositions/', selector: '.nbr-stack' },
    { route: '/utilities/', selector: '.nbr-u-wrapper' },
    { route: '/blocks/', selector: '.nbr-field' },
    { route: '/examples/', selector: '.nbr-button' },
  ];
  for (const { route, selector } of expectations) {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(sitePath(route));
    await expect(page.locator(selector).first(), `${route} ${selector}`).toBeVisible();
    const result = await page.evaluate((target) => {
      const element = document.querySelector(target);
      const style = getComputedStyle(element);
      return { overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, display: style.display };
    }, selector);
    expect(result.overflow, `${route} must not overflow at 320px`).toBe(false);
    expect(result.display, `${route} ${selector} must have computed package styling`).not.toBe('inline');
  }
  await page.goto(sitePath('/examples/'));
  await page.locator('[dir="rtl"]').evaluate((element) => { element.style.inlineSize = '280px'; });
  expect(await page.locator('[dir="rtl"]').evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');
  await page.goto(sitePath('/blocks/'));
  await page.locator('input[aria-invalid="true"]').focus();
  await expect(page.locator('input[aria-invalid="true"]')).toBeFocused();
  await expect(page.locator('input[aria-invalid="true"]')).toHaveAttribute('aria-describedby', 'docs-invalid-error');
});

test('button and field showcase states expose native semantics', async ({ page }) => {
  await page.goto(sitePath('/blocks/'));
  await expect(page.locator('button.nbr-button[disabled]')).toBeDisabled();
  await expect(page.locator('button[aria-disabled="true"]')).toHaveJSProperty('disabled', false);
  await expect(page.locator('button[aria-busy="true"]')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('input[required]')).toHaveAttribute('aria-describedby', 'docs-email-help');
  await expect(page.locator('input[aria-invalid="true"]')).toHaveAttribute('aria-describedby', 'docs-invalid-error');
  await expect(page.locator('[data-nbr-level="quiet"]')).toHaveCount(1);
  await expect(page.locator('[data-nbr-level="outlined"]')).toHaveCount(1);
  await expect(page.locator('[data-nbr-level="raised"]')).toHaveCount(1);
});

test('captures required showcase pages in light and dark desktop/mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium' || process.env.CAPTURE_EVIDENCE !== '1', 'evidence capture is opt-in Chromium only');
  const pages = [['home', '/'], ['foundations', '/foundations/'], ['compositions', '/compositions/'], ['utilities', '/utilities/'], ['blocks', '/blocks/'], ['examples', '/examples/']];
  for (const theme of ['light', 'dark']) {
    for (const [name, route] of pages) {
      for (const viewport of [{ label: 'desktop', width: 1280, height: 900 }, { label: 'mobile', width: 320, height: 900 }]) {
        await page.setViewportSize(viewport);
        await page.goto(sitePath(route));
        await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
        await page.screenshot({ path: `.evidence-cache/screenshots/showcase-${name}-${viewport.label}-${theme}.png`, fullPage: true });
      }
    }
  }
});
