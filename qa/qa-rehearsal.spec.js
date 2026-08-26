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

  // Chromium and Firefox can emulate the media condition. WebKit is covered by
  // the same test-controlled no-shadow stylesheet and labelled as a source fallback.
  const forcedColors = browserName === 'webkit' ? 'stylesheet-source-fallback' : 'emulated-when-supported';
  if (browserName !== 'webkit') await page.emulateMedia({ forcedColors: 'active' });
  await page.addStyleTag({ content: '.qa-focus:focus-visible { box-shadow: none !important; }' });

  const findings = [];
  const nativeAssociation = await page.locator('#qa-email').evaluate(el => Boolean(Array.from(el.labels ?? []).some(label => label.htmlFor === el.id)));
  if (!nativeAssociation) findings.push('missing-label');
  const clipped = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth || document.querySelector('main').scrollWidth > 320);
  if (clipped) findings.push('clipping-320');

  const button = page.locator('.qa-focus');
  await button.focus();
  const focusCue = await button.evaluate(el => {
    const style = getComputedStyle(el);
    const outlineVisible = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
    const boxShadowVisible = style.boxShadow !== 'none' && style.boxShadow !== '';
    return { outlineVisible, boxShadowVisible };
  });
  if (!focusCue.outlineVisible) findings.push('shadow-only-focus');
  if (seed === 'baseline') expect(focusCue.outlineVisible || focusCue.boxShadowVisible).toBe(true);
  if (seed === 'shadow-only-focus' || seed === 'combined') {
    expect(focusCue.outlineVisible).toBe(false);
    expect(focusCue.boxShadowVisible).toBe(false);
  }

  const axeViolations = (await new AxeBuilder({ page }).analyze()).violations.map(v => v.id);
  const hasAxeLabelViolation = axeViolations.includes('label');
  if (seed === 'baseline') {
    expect(hasAxeLabelViolation).toBe(false);
    expect(nativeAssociation).toBe(true);
  } else if (seed === 'missing-label' || seed === 'combined') {
    expect(hasAxeLabelViolation).toBe(true);
    expect(nativeAssociation).toBe(false);
  } else {
    expect(hasAxeLabelViolation).toBe(false);
  }

  await page.screenshot({ path: reportPath.replace('.json', `-${browserName}.png`), fullPage: true });
  expect(findings.sort()).toEqual(expected.sort());
  await writeFile(reportPath, JSON.stringify({
    schema: 'neobrui.qa.run/v1', browser: browserName, seed, expected, findings,
    falsePositives: findings.filter(f => !expected.includes(f)), duplicateDetections: [],
    axeViolations, semanticAssociation: nativeAssociation ? 'valid-native-label' : 'missing-native-label',
    axeLabelObservation: hasAxeLabelViolation ? 'supplemental-axe-label-violation' : 'none',
    forcedColors, focusCue,
  }, null, 2) + '\n');
});
