const ERROR_PREFIX = 'npm pack --json result error';

function fail(message) {
  throw new TypeError(`${ERROR_PREFIX}: ${message}`);
}

function parseInput(textOrValue) {
  if (typeof textOrValue !== 'string') return textOrValue;
  try {
    return JSON.parse(textOrValue);
  } catch (error) {
    fail(`invalid JSON (${error.message})`);
  }
}

function validateRecord(record, expectedName) {
  if (record === null || typeof record !== 'object' || Array.isArray(record)) fail('pack record must be an object');
  if (Object.hasOwn(record, 'name') && record.name !== expectedName) fail(`pack record name must be ${expectedName}`);
  if (Object.hasOwn(record, 'version') && (typeof record.version !== 'string' || !record.version)) fail('pack record version must be a nonempty string');
  if (typeof record.filename !== 'string' || !record.filename) fail('pack record filename must be a nonempty string');
  if (!Number.isFinite(record.size) || record.size <= 0) fail('pack record size must be a positive finite number');
  if (!Array.isArray(record.files) || record.files.length === 0) fail('pack record files must be a nonempty array');
  for (const [index, file] of record.files.entries()) {
    if (file === null || typeof file !== 'object' || Array.isArray(file)) fail(`file ${index} must be an object`);
    if (typeof file.path !== 'string' || !file.path) fail(`file ${index} path must be a nonempty string`);
    if (!Number.isFinite(file.size) || file.size < 0) fail(`file ${index} size must be a finite nonnegative number`);
  }
  return record;
}

export function parseNpmPackJson(textOrValue, expectedName) {
  if (typeof expectedName !== 'string' || !expectedName) fail('expected package name must be a nonempty string');
  const value = parseInput(textOrValue);
  let record;
  if (Array.isArray(value)) {
    if (value.length !== 1) fail(`expected exactly one pack record, received ${value.length}`);
    record = value[0];
  } else if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length !== 1) fail(`expected exactly one package key, received ${keys.length}`);
    if (keys[0] !== expectedName) fail(`package key must be ${expectedName}`);
    record = value[keys[0]];
  } else {
    fail('result must be an array or package-keyed object');
  }
  return validateRecord(record, expectedName);
}
