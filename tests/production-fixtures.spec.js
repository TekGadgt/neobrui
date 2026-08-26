import { test, expect } from '@playwright/test';

test.describe('built CSS Modules and Astro production fixtures', () => {
  test.skip(() => process.env.CAPTURE_EVIDENCE === '1', 'production fixture checks run in the full matrix, not evidence capture');
  test('CSS Modules hashed local class and global recipe coexist', async ({ page }) => {
    await page.goto('http://127.0.0.1:4174/css-modules/');
    const panel = page.locator('section');
    const button = page.locator('button');
    await expect(panel).toBeVisible();
    await expect(button).toBeVisible();
    const evidence = await page.evaluate(() => {
      const section = document.querySelector('section');
      const button = document.querySelector('button');
      return {
        classes: [...section.classList],
        panelPadding: getComputedStyle(section).padding,
        recipeBackground: getComputedStyle(button).backgroundColor,
        recipeBorder: getComputedStyle(button).borderWidth,

      };
    });
    expect(evidence.classes.some(name => /^_panel_[a-zA-Z0-9]+_\d+$/.test(name))).toBe(true);
    expect(evidence.classes).toContain('_nb-spike-surface');
    expect(evidence.panelPadding).toBe('16px');
    expect(evidence.recipeBackground).toBe('rgb(143, 45, 45)');
    expect(evidence.recipeBorder).toBe('2px');

  });

  test('Astro built route resolves global recipe and scoped application styles', async ({ page }) => {
    await page.goto('http://127.0.0.1:4174/astro/');
    const evidence = await page.evaluate(() => {
      const main = document.querySelector('main');
      const button = document.querySelector('button');
      const child = document.querySelector('.child');
      return {
        hasRecipe: Boolean(document.querySelector('link[href*="/_astro/"]')),
        mainBorder: getComputedStyle(main).borderStyle,
        mainBorderColor: getComputedStyle(main).borderColor,
        buttonBackground: getComputedStyle(button).backgroundColor,
        childColor: getComputedStyle(child).color,
        childText: child.textContent,
      };
    });
    expect(evidence.hasRecipe).toBe(true);
    expect(evidence.mainBorder).toBe('solid');
    expect(evidence.mainBorderColor).toBe('rgb(22, 101, 52)');
    expect(evidence.buttonBackground).toBe('rgb(143, 45, 45)');
    expect(evidence.childColor).toBe('rgb(30, 64, 175)');
    expect(evidence.childText).toContain('Scoped child content');
  });
});
