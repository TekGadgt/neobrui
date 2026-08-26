import assert from 'node:assert/strict';
import { writeFile, rm, mkdir, cp } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildSizeCandidate, verifySizeReport } from './size-spike.mjs';

const first = await buildSizeCandidate({ outputRoot: 'dist/size-spike' });
const second = await buildSizeCandidate({ outputRoot: 'dist/size-spike-second' });
assert.equal(verifySizeReport(first), true);
const fields = (report) => report.entries.map((e) => [e.name, e.rawBytes, e.minifiedBytes, e.gzipBytes, e.sha256]);
assert.deepEqual(fields(first), fields(second), 'two size runs differ');
assert.equal(first.archive.runtimeJavaScriptBytes, 0);
assert.equal(first.archive.runtimeAssetBytes, 0);

const consumer = 'dist/size-spike-consumer';
await rm(consumer, { recursive: true, force: true });
await mkdir(join(consumer, 'node_modules/@neobrui/private-spike-candidate'), { recursive: true });
await cp(join('dist/size-spike/package'), join(consumer, 'node_modules/@neobrui/private-spike-candidate'), { recursive: true });
await writeFile(join(consumer, 'package.json'), JSON.stringify({ type: 'module' }));
await writeFile(join(consumer, 'index.html'), '<link rel="stylesheet" href="/src.css"><main class="_nb-spike-button">local consumer</main>');
await writeFile(join(consumer, 'src.css'), '@import "@neobrui/private-spike-candidate";\n@import "@neobrui/private-spike-candidate/button";');
execFileSync('pnpm', ['exec', 'vite', 'build', '--outDir', 'out'], { cwd: consumer, stdio: 'inherit' });
first.consumer.build = 'passed with local archive only';
await writeFile('size-report.json', `${JSON.stringify(first, null, 2)}\n`);
await rm('dist/size-spike-second', { recursive: true, force: true });
await rm(consumer, { recursive: true, force: true });
console.log(`Size verification passed: ${first.entries.length} entries, deterministic hashes, CSS-only archive, local consumer build.`);
