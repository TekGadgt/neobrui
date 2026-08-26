import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = 'apps/docs/dist';
const required = ['index.html', 'sitemap-index.xml', 'pagefind'];

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

for (const path of required) {
  if (!await exists(join(root, path))) throw new Error(`Pages output is missing ${path}`);
}

const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);
const textFiles = files.filter(path => /\.(?:html|css|js|xml|json)$/.test(path));
const text = (await Promise.all(textFiles.map(path => readFile(path, 'utf8')))).join('\n');
if (!text.includes('/neobrui/')) throw new Error('Pages output has no /neobrui/ base URL');
if (!files.some(path => relative(root, path).startsWith('_astro/'))) throw new Error('Pages output has no _astro assets');
if (!files.some(path => relative(root, path).startsWith('pagefind/'))) throw new Error('Pages output has no Pagefind index');
if (!text.includes('/neobrui/_astro/')) throw new Error('Pages output does not reference base-prefixed assets');
console.log(`Pages output verified: ${files.length} files, ${textFiles.length} text files`);
