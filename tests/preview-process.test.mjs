import assert from 'node:assert/strict';
import test from 'node:test';
import { waitForOwnedPreviewExit } from '../scripts/preview-process.mjs';

test('preview teardown poll waits for a short-lived owned process', async () => {
  let calls = 0;
  const waited = await waitForOwnedPreviewExit({
    listOwned: () => (++calls < 3 ? [{ pid: 41, command: 'vite preview --port 4173' }] : []),
    intervalMs: 1,
    timeoutMs: 100,
  });
  assert.equal(waited, 2);
  assert.equal(calls, 3);
});

test('preview teardown poll fails with diagnostics for a persistent process', async () => {
  await assert.rejects(
    waitForOwnedPreviewExit({
      listOwned: () => [{ pid: 99, command: 'vite preview --port 4173' }],
      intervalMs: 1,
      timeoutMs: 5,
    }),
    error => error.code === 'PREVIEW_TEARDOWN_TIMEOUT' && /99.*vite preview/.test(error.message),
  );
});
