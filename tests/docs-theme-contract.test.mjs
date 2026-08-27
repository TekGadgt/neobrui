import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const css = () => readFile(resolve(root, 'apps/docs/src/styles/custom.css'), 'utf8');

test('docs theme defines independent accessible light and dark Starlight maps', async () => {
  const source = await css();
  assert.match(source, /\[data-theme=['"]light['"]\]/);
  assert.match(source, /\[data-theme=['"]dark['"]\]/);
  assert.match(source, /--sl-color-text: #18212b/);
  assert.match(source, /--sl-color-text: #f4f7fb/);
  assert.match(source, /--sl-color-accent: #0b6b4b/);
  assert.match(source, /--sl-color-accent: #70e1b5/);
  assert.match(source, /prefers-color-scheme: dark/);
  assert.match(source, /--nbr-docs-border: #18212b/);
  assert.match(source, /--nbr-docs-border: #dbe7f2/);
  assert.match(source, /--nbr-docs-control-border: #18212b/);
  assert.match(source, /--nbr-docs-control-border: #dbe7f2/);
});

test('docs theme contract documents ownership and Starlight upgrade checks', async () => {
  const readme = await readFile(resolve(root, 'apps/docs/README.md'), 'utf8');
  assert.match(readme, /theme rationale/i);
  assert.match(readme, /Starlight upgrade/i);
  assert.match(readme, /contrast/i);
});
