import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apps = {
  css: path.join(root, 'fixtures/css-modules/dist'),
  astro: path.join(root, 'fixtures/astro/dist'),
  consumer: path.join(root, 'tmp/consumer-fixture/out'),
};
const port = Number(process.argv[2] ?? 4174);
const contentTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.map': 'application/json' };

function resolveFile(urlPath) {
  const normalized = decodeURIComponent(urlPath.split('?')[0]);
  let base;
  let relative;
  if (normalized === '/css-modules/' || normalized.startsWith('/css-modules/')) {
    base = apps.css;
    relative = normalized.replace(/^\/css-modules\/?/, '') || 'index.html';
  } else if (normalized === '/astro/' || normalized.startsWith('/astro/')) {
    base = apps.astro;
    relative = normalized.replace(/^\/astro\/?/, '') || 'index.html';
  } else if (normalized.startsWith('/assets/')) {
    base = apps.css;
    relative = normalized.slice(1);
  } else if (normalized.startsWith('/_astro/')) {
    base = apps.astro;
    relative = normalized.slice(1);
  } else if (normalized === '/consumer/' || normalized.startsWith('/consumer/')) {
    base = apps.consumer;
    relative = normalized.replace(/^\/consumer\/?/, '') || 'index.html';
  } else {
    return null;
  }
  const file = path.resolve(base, relative);
  if (!file.startsWith(`${base}${path.sep}`) && file !== base) return null;
  try { return statSync(file).isFile() ? file : null; } catch { return null; }
}

const server = createServer((request, response) => {
  const file = resolveFile(request.url ?? '/');
  if (!file) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'content-type': contentTypes[path.extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});
server.listen(port, '127.0.0.1', () => console.log(`production fixture server listening on http://127.0.0.1:${port}`));
