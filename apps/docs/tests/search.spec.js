import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('search opens, names its input, and remains keyboard accessible', async ({ page }) => {
  await page.goto(`${process.env.PUBLIC_SITE_BASE || '/'}`);
  const trigger = page.getByRole('button', { name: /search/i }).first();
  await trigger.click();
  const input = page.locator('input:visible').first();
  await expect(input).toBeVisible();
  const name = await input.getAttribute('aria-label');
  const labelledBy = await input.getAttribute('aria-labelledby');
  const title = await input.getAttribute('title');
  expect(name || labelledBy || title).toBeTruthy();
  await input.focus();
  await expect(input).toBeFocused();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => v.id === 'label-title-only')).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
