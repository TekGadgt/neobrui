import { execFileSync } from 'node:child_process';

const run = (command, args) => {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  execFileSync(command, args, { stdio: 'inherit' });
};

run('pnpm', ['install', '--frozen-lockfile']);
run('pnpm', ['build:fixtures']);
run('pnpm', ['test']);
run('pnpm', ['capture:chromium']);

const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
if (status) {
  console.error('\nClean verification failed; repository status is not clean:');
  console.error(status);
  process.exit(1);
}

try {
  execFileSync('pgrep', ['-af', 'vite preview.*4173'], { stdio: 'pipe' });
  console.error('\nClean verification failed; an owned preview process remains.');
  process.exit(1);
} catch (error) {
  if (error.status !== 1) throw error;
}

console.log('\nClean verification passed: fixture builds, full suite, Chromium-only capture, clean tree, and preview-process check.');
