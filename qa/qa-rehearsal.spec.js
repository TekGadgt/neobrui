import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';

const seed = process.env.QA_VARIANT || 'baseline';
const htmlPath = process.env.QA_HTML;
const reportPath = process.env.QA_REPORT;
const expected = seed === 'combined' ? ['missing-label', 'clipping-320', 'shadow-only-focus'] : seed === 'baseline' ? [] : [seed];

test(`detectors classify ${seed}`, async ({ page, browserName }) => {
  await page.setContent(await readFile(htmlPath, 'utf8'));
  await page.setViewportSize({ width: 320, height: 240 });
  const findings = [];
  const labelOk = await page.locator('#qa-email').evaluate(el => Boolean(el.labels?.length || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')));
  if (!labelOk) findings.push('missing-label');
  const clipped = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth || document.querySelector('main').scrollWidth > 320);
  if (clipped) findings.push('clipping-320');
  const button = page.locator('.qa-focus');
  await button.focus();
  const visibleFocus = await button.evaluate(el => { const s = getComputedStyle(el); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0; });
  if (!visibleFocus) findings.push('shadow-only-focus');
  const axe = (await new AxeBuilder({ page }).analyze()).violations.map(v => v.id);
  await page.screenshot({ path: reportPath.replace('.json', `-${browserName}.png`), fullPage: true });
  expect(findings.sort()).toEqual(expected.sort());
  const forcedColors = browserName === 'webkit' ? 'stylesheet-source-fallback' : 'emulated-when-supported';
  await writeFile(reportPath, JSON.stringify({ schema: 'neobrui.qa.run/v1', browser: browserName, seed, expected, findings, falsePositives: findings.filter(f => !expected.includes(f)), duplicateDetections: [], axeViolations: axe, forcedColors }, null, 2) + '\n');
});
