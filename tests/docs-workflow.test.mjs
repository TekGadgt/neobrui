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
  assert.match(ci, /pnpm --filter neobrui-docs test --project=\$\{\{ matrix\.browser \}\}/);
  assert.match(ci, /pnpm --filter neobrui-docs build:root[\s\S]*pnpm --filter neobrui-docs test/);
  assert.match(ci, /pnpm pack:smoke/);
  const pages = fs.readFileSync(workflows[1], 'utf8');
  assert.match(pages, /pnpm --filter neobrui-docs build:pages/);
});
