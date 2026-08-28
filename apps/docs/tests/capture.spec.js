import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

test.describe.configure({ mode: 'serial' });

const out = join(process.cwd(), 'evidence/screenshots');
const manifestPath = join(out, 'manifest.json');
const cases = [['neutral', 'light'], ['neutral', 'dark'], ['product', 'light'], ['product', 'dark']];
const tokenNames = ['--nbr-color-text', '--nbr-color-canvas', '--nbr-color-border', '--nbr-color-shadow', '--nbr-radius-control'];

function snapshot(locator) {
  return locator.evaluate((element, names) => {
    const style = getComputedStyle(element);
    return {
      ...Object.fromEntries(names.map(name => [name, style.getPropertyValue(name).trim()])),
      color: style.color,
      backgroundColor: style.backgroundColor,
      borderTopColor: style.borderTopColor,
      boxShadow: style.boxShadow,
      borderRadius: style.borderRadius,
    };
  }, tokenNames);
}

for (const [identity, theme] of cases) for (const [label, width] of [['desktop', 1280], ['mobile', 320]]) {
  test(`${identity} ${label} ${theme} capture`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: theme });
    const bad = [];
    page.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
    const response = await page.goto('/patterns/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Patterns', level: 1 })).toBeVisible();

    const neutral = page.locator('[data-specimen="neutral"]');
    const product = page.locator('[data-specimen="product"]');
    await expect(neutral).toBeVisible();
    await expect(product).toBeVisible();
    const normalizeAnatomy = element => element.innerHTML.replace(/Neutral identity: default|Product identity: Coral Ledger|Neutral supporting callout|Coral Ledger supporting callout|Neutral specimen navigation|Coral Ledger specimen navigation/g, 'IDENTITY');
    expect(await neutral.evaluate(normalizeAnatomy)).toBe(await product.evaluate(normalizeAnatomy));
    const specimen = identity === 'product' ? product : neutral;
    await page.evaluate(selected => {
      for (const element of document.querySelectorAll('[data-specimen]')) {
        if (element !== selected) element.style.display = 'none';
      }
    }, await specimen.elementHandle());
    if (identity === 'product') await expect(specimen).toHaveAttribute('aria-label', 'Product identity: Coral Ledger');
    expect(await page.evaluate(expectedWidth => innerWidth === expectedWidth, width)).toBe(true);
    expect(await page.evaluate(expectedTheme => matchMedia(`(prefers-color-scheme: ${expectedTheme})`).matches, theme)).toBe(true);

    const roles = await snapshot(specimen);
    if (identity === 'product') {
      const neutralRoles = await neutral.evaluate((element, names) => {
        const style = getComputedStyle(element);
        return Object.fromEntries(names.map(name => [name, style.getPropertyValue(name).trim()]));
      }, tokenNames);
      for (const name of tokenNames) expect(roles[name], name).not.toBe(neutralRoles[name]);
      expect(await specimen.evaluate(element => {
        const style = getComputedStyle(element);
        const luminance = value => {
          const channels = value.match(/rgba?\(([^)]+)\)/)?.[1].split(',').map(Number);
          if (!channels) return null;
          return channels.slice(0, 3).map(channel => channel / 255).map(channel => channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
        };
        const foreground = luminance(style.color);
        const background = luminance(style.backgroundColor);
        return foreground !== null && background !== null && (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05) >= 4.5;
      })).toBe(true);
    } else {
      expect(await specimen.getAttribute('data-nbr-example-theme')).toBeNull();
    }
    expect(bad).toEqual([]);
    mkdirSync(out, { recursive: true });
    const file = join(out, `${identity}-${label}-${theme}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const sha256 = createHash('sha256').update(readFileSync(file)).digest('hex');
    const list = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const record = { identity, theme, viewport: { width, height: 900 }, route: '/patterns/', h1: 'Patterns', file: `screenshots/${identity}-${label}-${theme}.png`, sha256, dimensions: { width, height: await page.evaluate(() => document.documentElement.scrollHeight) } };
    if (identity === 'product') {
      record.marker = 'Product identity: Coral Ledger';
      record.tokens = roles;
    }
    const index = list.findIndex(item => item.identity === identity && item.theme === theme && item.viewport.width === width);
    if (index === -1) list.push(record); else list[index] = record;
    writeFileSync(manifestPath, JSON.stringify(list, null, 2) + '\n');
  });
}

test('product evidence contract contains exactly eight unique paired captures', async () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  expect(manifest).toHaveLength(8);
  expect(new Set(manifest.map(item => `${item.identity}-${item.label ?? item.viewport.width}-${item.theme}`)).size).toBe(8);
  for (const theme of ['light', 'dark']) for (const label of ['desktop', 'mobile']) {
    const neutral = manifest.find(item => item.identity === 'neutral' && item.theme === theme && item.viewport.width === (label === 'desktop' ? 1280 : 320));
    const product = manifest.find(item => item.identity === 'product' && item.theme === theme && item.viewport.width === (label === 'desktop' ? 1280 : 320));
    expect(product.sha256).not.toBe(neutral.sha256);
    expect(product.tokens).toBeTruthy();
    expect(product.marker).toBe('Product identity: Coral Ledger');
    expect(product.dimensions).toEqual(neutral.dimensions);
  }
  const light = manifest.find(item => item.identity === 'product' && item.theme === 'light' && item.viewport.width === 1280);
  const dark = manifest.find(item => item.identity === 'product' && item.theme === 'dark' && item.viewport.width === 1280);
  expect(light.tokens).not.toEqual(dark.tokens);
  expect(new Set(manifest.map(item => item.sha256)).size).toBe(manifest.length);
});
