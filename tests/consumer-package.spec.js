import { test, expect } from '@playwright/test';

test.describe('installed private archive consumer', () => {
  test('resolves aggregate, button, and foundations CSS with no external requests', async ({ page }) => {
    const requests = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto('http://127.0.0.1:4174/consumer/');
    const evidence = await page.locator('button').evaluate(button => ({
      buttonBackground: getComputedStyle(button).backgroundColor,
      buttonBorder: getComputedStyle(button).borderWidth,
      stylesheets: [...document.styleSheets].map(sheet => new URL(sheet.href).pathname),
      scripts: [...document.scripts].map(script => script.src),
    }));
    expect(evidence.buttonBackground).toBe('rgb(143, 45, 45)');
    expect(evidence.buttonBorder).toBe('2px');
    expect(evidence.stylesheets.every(path => path.startsWith('/consumer/assets/'))).toBe(true);
    expect(evidence.stylesheets.length).toBe(2);
    expect(evidence.scripts).toEqual([]);
    expect(requests.every(url => url.startsWith('http://127.0.0.1:4174/consumer/'))).toBe(true);
    expect(requests.some(url => url.endsWith('.css'))).toBe(true);
    await page.goto('http://127.0.0.1:4174/consumer/foundations.html');
    await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute('href', /\/consumer\/assets\/foundations-/);
  });
});
