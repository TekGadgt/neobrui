import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import { buildSizeCandidate, verifySizeReport } from './size-package.mjs';

const generated = await buildSizeCandidate({ outputRoot: 'dist/size-package' });
const committed = JSON.parse(await readFile('size-report.json', 'utf8'));
assert.equal(verifySizeReport(generated), true);
assert.deepEqual(generated, committed, 'size-report.json is stale; run measure:size, review, and commit it');
await rm('dist/size-package-second', { recursive: true, force: true });
console.log(`Size verification passed: ${generated.entries.length} entries, deterministic emitted consumer CSS, CSS-only archive, stable source manifest.`);
