import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as tar from 'tar';

const root = fileURLToPath(new URL('..', import.meta.url));
const archive = join(root, 'dist/release/neobrui-0.1.0-alpha.0.tgz');
const destination = join(root, 'apps/docs/.generated/neobrui');
const expectedArchive = (await readFile(join(root, 'dist/release/SHA256SUMS'), 'utf8')).match(/^([0-9a-f]{64})\s+neobrui-0\.1\.0-alpha\.0\.tgz$/m)?.[1];
if (!expectedArchive) throw new Error('Missing canonical release checksum');
const archiveBytes = await readFile(archive);
const actualArchive = createHash('sha256').update(archiveBytes).digest('hex');
if (actualArchive !== expectedArchive) throw new Error(`Release checksum mismatch: expected ${expectedArchive}, got ${actualArchive}`);

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
const allowed = new Set([
  'package.json', 'README.md', 'LICENSE', 'tokens.dtcg.json', 'dist/blocks.css', 'dist/index.css', 'dist/tokens.css',
  'dist/blocks/button.css', 'dist/blocks/field.css', 'dist/blocks/surface.css', 'dist/utilities/wrapper.css',
  'dist/utilities/visually-hidden.css', 'dist/compositions/stack.css', 'dist/compositions/cluster.css',
]);
const entries = [];
await tar.t({ file: archive, onReadEntry: entry => entries.push(entry.path) });
for (const entry of entries) {
  if (!entry.startsWith('package/') || entry.includes('..') || !allowed.has(entry.slice('package/'.length))) {
    throw new Error(`Unexpected release archive entry: ${entry}`);
  }
}
await tar.x({ file: archive, cwd: destination, strip: 1, filter: path => allowed.has(path.slice('package/'.length)) });
for (const file of allowed) {
  const path = join(destination, file);
  const bytes = await readFile(path).catch(() => null);
  if (!bytes) throw new Error(`Prepared docs artifact is missing ${file}`);
}
await writeFile(join(destination, '.archive-sha256'), `${actualArchive}\n`);
console.log(`Prepared ${relative(root, destination)} from canonical release ${actualArchive}`);
