import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

test.describe.configure({ mode: 'serial' });

const out = join(process.cwd(), 'evidence/screenshots');
const manifestPath = join(out, 'manifest.json');
const neutralHashes = {
  'desktop-light': '40c06097db87e5008f60566e0cf31bee864a08cbdf7219c08fcedf74a7b40d9f',
  'mobile-light': '26337577d506c26f925072b4fecbc8ae52a9c6e7a16748bba0bbf71faa850065',
  'desktop-dark': 'b6f51106e57b46259db32da6d6d84fec0aa081accd5dcd58b56624b5b0cfe945',
  'mobile-dark': '6b923a7cfcf8302ede7029a082dff65778f18756410d3ce4f1a61325f240a862',
};
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
    const specimen = page.locator('[data-specimen="product"]');
    if (identity === 'neutral') await specimen.evaluate(element => element.removeAttribute('data-nbr-example-theme'));
    await expect(specimen).toBeVisible();
    if (identity === 'product') {
      await expect(specimen).toHaveAttribute('aria-label', 'Product identity: Coral Ledger');
    }
    expect(await page.evaluate(expectedWidth => innerWidth === expectedWidth, width)).toBe(true);
    expect(await page.evaluate(expectedTheme => matchMedia(`(prefers-color-scheme: ${expectedTheme})`).matches, theme)).toBe(true);
    if (identity === 'product') await specimen.evaluate(element => element.removeAttribute('data-nbr-example-theme'));
    const neutral = await snapshot(specimen);
    if (identity === 'product') await specimen.evaluate(element => element.setAttribute('data-nbr-example-theme', 'product'));
    if (identity === 'product') {
      await expect(specimen).toHaveAttribute('data-nbr-example-theme', 'product');
      const product = await snapshot(specimen);
      for (const name of tokenNames) expect(product[name], name).not.toBe(neutral[name]);
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
      expect(product['--nbr-color-text']).not.toBe('');
    } else {
      expect(await specimen.getAttribute('data-nbr-example-theme')).toBeNull();
      expect(await snapshot(specimen)).toEqual(neutral);
    }
    expect(bad).toEqual([]);
    mkdirSync(out, { recursive: true });
    const file = join(out, `${identity}-${label}-${theme}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const sha256 = createHash('sha256').update(readFileSync(file)).digest('hex');
    const pair = `${label}-${theme}`;
    if (identity === 'neutral') expect(sha256).toBe(neutralHashes[pair]);
    else expect(sha256).not.toBe(neutralHashes[pair]);
    const list = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const record = { identity, theme, viewport: { width, height: 900 }, route: '/patterns/', h1: 'Patterns', file: `screenshots/${identity}-${label}-${theme}.png`, sha256, dimensions: { width: 0, height: await page.evaluate(() => document.documentElement.scrollHeight) } };
    record.dimensions.width = width;
    if (identity === 'product') {
      record.marker = 'Product identity: Coral Ledger';
      record.tokens = await snapshot(specimen);
    }
    const index = list.findIndex(item => item.identity === identity && item.theme === theme && item.viewport.width === width);
    if (index === -1) list.push(record); else list[index] = record;
    writeFileSync(manifestPath, JSON.stringify(list, null, 2) + '\n');
  });
}

test('product evidence contract rejects duplicate paired hashes and differs in both themes', async () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  for (const theme of ['light', 'dark']) {
    const neutral = manifest.find(item => item.identity === 'neutral' && item.theme === theme && item.viewport.width === 1280);
    const product = manifest.find(item => item.identity === 'product' && item.theme === theme && item.viewport.width === 1280);
    expect(product.sha256).not.toBe(neutral.sha256);
    expect(product.tokens).toBeTruthy();
    expect(product.marker).toBe('Product identity: Coral Ledger');
  }
  const light = manifest.find(item => item.identity === 'product' && item.theme === 'light' && item.viewport.width === 1280);
  const dark = manifest.find(item => item.identity === 'product' && item.theme === 'dark' && item.viewport.width === 1280);
  expect(light.tokens).not.toEqual(dark.tokens);
  expect(new Set(manifest.map(item => item.sha256)).size).toBe(manifest.length);
});
