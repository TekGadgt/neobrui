import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflow = await readFile(new URL('../.github/workflows/release-rehearsal.yml', import.meta.url), 'utf8');

test('release rehearsal is read-only and runs the native platform matrix', () => {
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /os:\s*\[ubuntu-latest, macos-15\]/);
  assert.match(workflow, /needs:\s*rehearse/);
  assert.match(workflow, /cancel-in-progress:\s*true/);
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40}/);
  assert.match(workflow, /actions\/setup-node@[0-9a-f]{40}/);
  assert.match(workflow, /pnpm\/action-setup@[0-9a-f]{40}/);
  assert.match(workflow, /actions\/(?:upload|download)-artifact@[0-9a-f]{40}/);
  assert.doesNotMatch(workflow, /npm\s+publish|npm\s+tag|git\s+push|gh\s+release|id-token|contents:\s*write|secrets\.|environment:|NODE_AUTH_TOKEN|NPM_TOKEN/i);
});
