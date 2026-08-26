import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

export function listOwnedPreviewProcesses({ repoRoot = process.cwd(), host = '127.0.0.1', port = 4173 } = {}) {
  const root = realpathSync(repoRoot);
  const lines = execFileSync('ps', ['-eo', 'pid=,args='], { encoding: 'utf8' }).split('\n');
  const owned = [];
  for (const line of lines) {
    const match = line.trim().match(/^(\d+)\s+(.*)$/);
    if (!match) continue;
    const [, pidText, command] = match;
    if (!/vite\s+preview\b/.test(command) || !new RegExp(`--port\\s+${port}(?:\\s|$)`).test(command)) continue;
    try {
      if (realpathSync(`/proc/${pidText}/cwd`) !== root) continue;
    } catch {
      continue;
    }
    if (host && !command.includes(host)) continue;
    owned.push({ pid: Number(pidText), command });
  }
  return owned;
}

export async function waitForOwnedPreviewExit({
  listOwned = () => listOwnedPreviewProcesses(),
  intervalMs = 100,
  timeoutMs = 5000,
} = {}) {
  const started = Date.now();
  let checks = 1;
  let processes = listOwned();
  while (processes.length > 0 && Date.now() - started < timeoutMs) {
    await delay(intervalMs);
    checks += 1;
    processes = listOwned();
  }
  if (processes.length > 0) {
    const error = new Error(`Owned preview process teardown timed out after ${timeoutMs}ms: ${processes.map(({ pid, command }) => `${pid} ${command}`).join(' | ')}`);
    error.code = 'PREVIEW_TEARDOWN_TIMEOUT';
    throw error;
  }
  return checks - 1;
}
