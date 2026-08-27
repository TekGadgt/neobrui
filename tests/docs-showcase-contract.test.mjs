import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const read = (path) => readFile(path, 'utf8');

const contract = JSON.parse(await read('apps/docs/tests/showcase-coverage.json'));
const routesRoot = 'apps/docs/src/content/docs';

test('showcase contract covers every public CSS export and finite attribute', async () => {
  const packageJson = JSON.parse(await read('apps/docs/.generated/neobrui/package.json'));
  const exports = Object.entries(packageJson.exports)
    .filter(([, target]) => target.endsWith('.css'))
    .map(([name]) => name);
  assert.deepEqual(contract.exports.map(({ export: name }) => name).sort(), exports.sort());
  const sourceByRoute = new Map(await Promise.all(contract.exports.map(async (entry) => [entry.route, await read(`${routesRoot}/${entry.route}/index.mdx`)])));
  for (const entry of contract.exports) {
    const source = sourceByRoute.get(entry.route);
    assert.ok(source, `${entry.export} route exists`);
    assert.match(source, new RegExp(entry.selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${entry.export} is rendered in ${entry.route}`);
  }
  for (const attribute of contract.attributes) {
    const source = await read(`${routesRoot}/${attribute.route}/index.mdx`);
    assert.match(source, new RegExp(attribute.pattern), `${attribute.name} is rendered in ${attribute.route}`);
  }
});

test('visually hidden showcase presents contextual status without a fake action', async () => {
  const source = await read(`${routesRoot}/utilities/index.mdx`);
  assert.equal(source.includes('<button'), false);
  assert.equal(source.includes('aria-hidden="true"'), true);
  assert.equal(source.includes('<span class="nbr-u-visually-hidden">Status:</span>'), true);
  assert.equal(source.includes('Draft saved.</p>'), true);
  assert.equal(source.includes('Status:</span> Draft saved.'), true);
});

test('docs consume only the prepared archive and record its checksum', async () => {
  const sources = await Promise.all(contract.docsSources.map(read));
  for (const source of sources) assert.doesNotMatch(source, /(?:\.\.\/)+packages\//);
  const checksum = (await read('apps/docs/.generated/neobrui/.archive-sha256')).trim();
  assert.match(checksum, /^[0-9a-f]{64}$/);
  assert.match(await read('apps/docs/src/styles/custom.css'), /@import 'neobrui\/(tokens|blocks)'/);
});

test('showcase sources remain clean and root verification contracts pass', () => {
  assert.equal(execFileSync('git', ['diff', '--check'], { encoding: 'utf8' }), '');
});
