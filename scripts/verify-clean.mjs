import { execFileSync } from 'node:child_process';
import { waitForOwnedPreviewExit } from './preview-process.mjs';

const run = (command, args) => {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  execFileSync(command, args, { stdio: 'inherit' });
};

run('pnpm', ['install', '--frozen-lockfile']);
run('pnpm', ['build:fixtures']);
run('pnpm', ['verify:size']);
run('pnpm', ['test']);
run('pnpm', ['capture:chromium']);

try {
  const waitedChecks = await waitForOwnedPreviewExit({ repoRoot: process.cwd() });
  console.log(`\nPreview teardown poll passed: no owned preview process after ${waitedChecks} checks (100ms interval, 5000ms timeout).`);
} catch (error) {
  console.error(`\n${error.message}`);
  process.exit(1);
}

const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
if (status) {
  console.error('\nClean verification failed; repository status is not clean:');
  console.error(status);
  process.exit(1);
}

console.log('\nClean verification passed: fixture builds, full suite, Chromium-only capture, clean tree, and bounded preview-process teardown poll.');
