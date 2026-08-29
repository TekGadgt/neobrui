import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNpmPackJson } from '../tools/npm-pack-result.mjs';

const name = '@tekgadgt/neobrui';
const record = {
  id: `${name}@0.1.0-alpha.0`,
  name,
  version: '0.1.0-alpha.0',
  filename: 'tekgadgt-neobrui-0.1.0-alpha.0.tgz',
  size: 4321,
  packageSize: 1234,
  unpackedSize: 5678,
  shasum: 'abc',
  integrity: 'sha512-abc',
  files: [{ path: 'package.json', size: 100, mode: 420 }],
};

const npm11 = JSON.stringify([record]);
const npm12 = JSON.stringify({ [name]: record });

test('parses npm 11 array and npm 12 scoped object to identical records', () => {
  assert.deepEqual(parseNpmPackJson(npm11, name), record);
  assert.deepEqual(parseNpmPackJson(npm12, name), record);
  assert.deepEqual(parseNpmPackJson(npm11, name), parseNpmPackJson(npm12, name));
});

test('accepts an already parsed npm pack result', () => {
  assert.deepEqual(parseNpmPackJson({ [name]: record }, name), record);
});

for (const [label, value] of [
  ['malformed JSON', '{'],
  ['null', 'null'],
  ['scalar', '42'],
  ['empty array', '[]'],
  ['multiple array records', JSON.stringify([record, record])],
  ['empty object', '{}'],
  ['multiple object keys', JSON.stringify({ [name]: record, other: record })],
  ['wrong object key', JSON.stringify({ '@wrong/package': record })],
  ['wrong record name', JSON.stringify([{ ...record, name: '@wrong/package' }])],
  ['missing filename', JSON.stringify([{ ...record, filename: '' }])],
  ['missing size', JSON.stringify([{ ...record, size: 0 }])],
  ['missing files', JSON.stringify([{ ...record, files: [] }])],
  ['malformed file record', JSON.stringify([{ ...record, files: [{ path: '', size: -1 }] }])],
]) {
  test(`rejects ${label} with an npm pack error`, () => {
    assert.throws(() => parseNpmPackJson(value, name), /npm pack --json/);
  });
}
