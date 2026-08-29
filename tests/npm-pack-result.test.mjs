import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNpmPackJson } from '../tools/npm-pack-result.mjs';

const name = '@tekgadgt/neobrui';
const version = '0.1.0-alpha.0';
const options = { expectedName: name, expectedVersion: version };
const record = {
  id: `${name}@${version}`,
  name,
  version,
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

const forms = record => [
  JSON.stringify([record]),
  JSON.stringify({ [name]: record }),
];

test('parses npm 11 array and npm 12 scoped object to identical records', () => {
  assert.deepEqual(parseNpmPackJson(npm11, options), record);
  assert.deepEqual(parseNpmPackJson(npm12, options), record);
  assert.deepEqual(parseNpmPackJson(npm11, options), parseNpmPackJson(npm12, options));
});

test('accepts an already parsed npm pack result', () => {
  assert.deepEqual(parseNpmPackJson({ [name]: record }, options), record);
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
  ['wrong record version', JSON.stringify([{ ...record, version: '0.1.0-alpha.1' }])],
  ['whitespace record name', JSON.stringify([{ ...record, name: '   ' }])],
  ['whitespace record version', JSON.stringify([{ ...record, version: '\t' }])],
  ['missing array record name', JSON.stringify([{ ...record, name: undefined }])],
  ['missing array record version', JSON.stringify([{ ...record, version: undefined }])],
  ['missing keyed record name', JSON.stringify({ [name]: { ...record, name: undefined } })],
  ['missing keyed record version', JSON.stringify({ [name]: { ...record, version: undefined } })],
  ['missing filename', JSON.stringify([{ ...record, filename: '' }])],
  ['missing size', JSON.stringify([{ ...record, size: 0 }])],
  ['missing files', JSON.stringify([{ ...record, files: [] }])],
  ['malformed file record', JSON.stringify([{ ...record, files: [{ path: '', size: -1 }] }])],
]) {
  test(`rejects ${label} with an npm pack error`, () => {
    assert.throws(() => parseNpmPackJson(value, options), /npm pack --json/);
  });
}

for (const [label, value] of [
  ['array', forms({ ...record, name: undefined })[0]],
  ['keyed object', forms({ ...record, name: undefined })[1]],
]) {
  test(`rejects missing name in ${label} form clearly`, () => {
    assert.throws(() => parseNpmPackJson(value, options), /name must be a nonempty string/);
  });
}

for (const [label, value] of [
  ['array', forms({ ...record, version: undefined })[0]],
  ['keyed object', forms({ ...record, version: undefined })[1]],
]) {
  test(`rejects missing version in ${label} form clearly`, () => {
    assert.throws(() => parseNpmPackJson(value, options), /version must be a nonempty string/);
  });
}
