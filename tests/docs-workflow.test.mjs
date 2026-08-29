import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflows = ['.github/workflows/ci.yml', '.github/workflows/pages.yml'];
test('docs workflows use authored build and docs-local browser boundaries', () => {
  for (const file of workflows) {
    const source = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /production-fixtures-server|playwright\.config(?:\.js)?/);
    assert.match(source, /pnpm --filter neobrui-docs (?:check|build)/);
  }
  const ci = fs.readFileSync(workflows[0], 'utf8');
  assert.match(ci, /browser: \[chromium, firefox, webkit\]/);
  assert.doesNotMatch(ci, /matrix\.site|site: \[root, pages\]|root Playwright|build:root/);
  assert.equal((ci.match(/browser: \[chromium, firefox, webkit\]/g) || []).length, 1);
  assert.match(ci, /PUBLIC_SITE_BASE=\/neobrui\/ PUBLIC_SITE_URL=https:\/\/tekgadgt\.github\.io\/neobrui\/ pnpm --filter neobrui-docs build:pages/);
  assert.match(ci, /PUBLIC_SITE_BASE=\/neobrui\/ PUBLIC_SITE_URL=https:\/\/tekgadgt\.github\.io\/neobrui\/ pnpm --filter neobrui-docs test --project=\$\{\{ matrix\.browser \}\}/);
  assert.match(ci, /Build current Starlight artifact[\s\S]*Run docs-local Playwright/);
  assert.match(ci, /pnpm pack:smoke/);
  const pages = fs.readFileSync(workflows[1], 'utf8');
  assert.match(pages, /pnpm --filter neobrui-docs build:pages/);
  assert.match(pages, /Pages Playwright/);
  assert.match(pages, /browser: \[chromium, firefox, webkit\]/);
  assert.match(pages, /build:pages[\s\S]*test --project=\$\{\{ matrix\.browser \}\}/);
  assert.match(pages, /needs: \[build, browsers\]/);
});

test('stale root and QA browser architecture is absent', () => {
  const forbidden = [
    'playwright.config.js',
    'qa/playwright.config.js',
    'qa/qa-rehearsal.spec.js',
    'tests/baseline.spec.js',
    'tests/blocks.spec.js',
    'tests/coexistence.spec.js',
    'tests/consumer-package.spec.js',
    'tests/multi-page.spec.js',
    'tests/neutral-site.spec.js',
    'tests/production-fixtures.spec.js',
    'tests/shadow-direction.spec.js',
  ];
  for (const file of forbidden) assert.equal(fs.existsSync(file), false, `${file} must be deleted`);
  for (const file of workflows) {
    const source = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /production-fixtures-server|root Playwright|qa-rehearsal/);
  }
  const packageSource = fs.readFileSync('package.json', 'utf8');
  assert.doesNotMatch(packageSource, /production-fixtures-server|playwright test/);
  assert.equal(fs.existsSync('apps/docs/playwright.config.js'), true);
  assert.equal(fs.existsSync('apps/docs/tests/routes.spec.js'), true);
});
