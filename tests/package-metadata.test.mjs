import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

 test('private scoped prerelease metadata has the approved public intent', () => {
  assert.equal(packageJson.name, '@tekgadgt/neobrui');
  assert.equal(packageJson.version, '0.1.0-alpha.0');
  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.publishConfig, { access: 'public', registry: 'https://registry.npmjs.org/' });
  assert.deepEqual(packageJson.repository, { type: 'git', url: 'git+https://github.com/TekGadgt/neobrui.git' });
  assert.equal(packageJson.homepage, 'https://tekgadgt.github.io/neobrui/');
  assert.equal(packageJson.bugs.url, 'https://github.com/TekGadgt/neobrui/issues');
  assert.equal(packageJson.license, 'MIT');
  assert.deepEqual(packageJson.sideEffects, ['*.css']);
  assert.equal(packageJson.dependencies, undefined);
  assert.equal(packageJson.peerDependencies, undefined);
  assert.equal(packageJson.optionalDependencies, undefined);
  assert.equal(Object.keys(packageJson.scripts).some(name => /publish|release|stage|tag/i.test(name)), false);
});

test('future tag fixture matches the candidate version without creating a tag', () => {
  const tag = 'v0.1.0-alpha.0';
  assert.equal(tag.slice(1), packageJson.version);
});

test('package examples use the scoped specifier and preserve current install truth', async () => {
  const files = [
    'README.md',
    'apps/docs/src/content/docs/index.mdx',
    'apps/docs/src/content/docs/adoption.mdx',
    'skills/neobrui/SKILL.md',
  ];
  const sources = await Promise.all(files.map(file => readFile(path.join(root, file), 'utf8')));
  for (const source of sources) {
    assert.doesNotMatch(source, /(?:import|@import) ['"]neobrui(?:['"/])/);
    assert.doesNotMatch(source, /"neobrui"\s*:\s*"workspace:\*/);
  }
  assert.match(sources[0], /@tekgadgt\/neobrui/);
  assert.match(sources[1], /not launched yet|not currently available/i);
});

test('release controls contain no npm publishing workflow or credential', async () => {
  const workflowDir = path.join(root, '.github', 'workflows');
  for (const file of await readdir(workflowDir)) {
    const source = await readFile(path.join(workflowDir, file), 'utf8');
    assert.doesNotMatch(source, /npm\s+publish|npm_publish|NPM_TOKEN|NODE_AUTH_TOKEN/i, file);
  }
});
