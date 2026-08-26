import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  stack: 'src/compositions/stack.css',
  cluster: 'src/compositions/cluster.css',
  visuallyHidden: 'src/utilities/visually-hidden.css',
  wrapper: 'src/utilities/wrapper.css',
};
const css = Object.fromEntries(await Promise.all(Object.entries(files).map(async ([name, path]) => [name, await readFile(path, 'utf8')])));

const rules = Object.fromEntries(Object.entries(css).map(([name, source]) => [name, source.replace(/\/\*[\s\S]*?\*\//g, '')]));

assert.match(rules.stack, /@layer nbr\.compositions/);
assert.match(rules.stack, /\.nbr-stack\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*gap:\s*var\(--nbr-stack-gap, var\(--nbr-space-4\)\)/s);
assert.doesNotMatch(rules.stack, /\.nbr-stack\s*>/);
assert.doesNotMatch(rules.stack, /margin/);
assert.match(rules.cluster, /flex-wrap:\s*wrap/);
assert.match(rules.cluster, /var\(--nbr-cluster-gap, var\(--nbr-space-3\)\)/);
assert.match(rules.cluster, /var\(--nbr-cluster-align, center\)/);
assert.match(rules.cluster, /var\(--nbr-cluster-justify, flex-start\)/);
assert.doesNotMatch(rules.cluster, /margin|left|right/);
assert.match(rules.visuallyHidden, /clip-path:\s*inset\(50%\)/);
assert.doesNotMatch(rules.visuallyHidden, /!important|display:\s*none|visibility:\s*hidden/);
assert.match(rules.wrapper, /max-inline-size:\s*var\(--nbr-wrapper-max-inline-size, var\(--nbr-size-content\)\)/);
assert.match(rules.wrapper, /padding-inline:\s*var\(--nbr-wrapper-padding-inline, var\(--nbr-space-4\)\)/);
assert.match(rules.wrapper, /margin-inline:\s*auto/);
console.log('composition and utility contracts: passed');
