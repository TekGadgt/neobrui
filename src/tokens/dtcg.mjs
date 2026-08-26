import { createHash } from 'node:crypto';
import { flattenTokens, REQUIRED_ROLES, validateTokens } from './schema.mjs';
import { normalizeTokenPath } from './tokens.mjs';

export const DTCG_VERSION = '2025.10';
const EXTENSION = 'org.neobrui';
const TYPE_BY_FAMILY = Object.freeze({ color: 'color', border: 'border', radius: 'dimension', shadow: 'shadow', space: 'dimension', control: 'dimension', region: 'dimension', font: 'fontFamily', text: 'dimension', motion: 'duration', focus: 'dimension', surface: 'color', button: 'color', field: 'color' });
const clone = value => structuredClone(value);

function tokenValue(value) { return value && typeof value === 'object' && '$value' in value ? value.$value : value; }
function tokenType(family, value) { return value && typeof value === 'object' && value.$type ? value.$type : TYPE_BY_FAMILY[family]; }
function sourceValue(value, path, all) {
  const raw = tokenValue(value);
  if (typeof raw !== 'string') throw new Error(`Invalid token value "${path}"`);
  const ref = raw.match(/^\{([^{}]+)\}$/)?.[1];
  if (!ref) return raw;
  const target = all.get(ref);
  if (target === undefined) throw new Error(`Unresolved token reference "${path}" -> "${ref}"`);
  return sourceValue(target, ref, all);
}
function resolvedTheme(tokens) {
  const normalized = new Set();
  for (const [path] of flattenTokens(tokens)) {
    const key = normalizeTokenPath(path);
    if (normalized.has(key)) throw new Error(`Token path collision after normalization "${path}"`);
    normalized.add(key);
  }
  const errors = validateTokens(tokens, { allowObjects: true });
  if (errors.length) throw new Error(errors.join('; '));
  const all = new Map(flattenTokens(tokens));
  const out = {};
  for (const [path, value] of all) {
    const [family, role] = path.split('.');
    out[family] ??= {};
    out[family][role] = sourceValue(value, path, all);
  }
  return out;
}
function sortedTokenObject(tokens) {
  const result = {};
  for (const family of Object.keys(tokens).sort()) {
    result[family] = {};
    for (const role of Object.keys(tokens[family]).sort()) {
      const value = tokens[family][role];
      const raw = tokenValue(value);
      const entry = { $value: raw };
      const type = tokenType(family, value);
      if (type) entry.$type = type;
      result[family][role] = entry;
    }
  }
  return result;
}
function assertDtcgObject(document) {
  if (!document || typeof document !== 'object' || Array.isArray(document)) throw new Error('DTCG document must be an object');
  for (const key of Object.keys(document)) {
    if (key.startsWith('$') && key !== '$extensions' && key !== '$schema') throw new Error(`Unknown DTCG property "${key}"`);
  }
  if (document.$extensions) {
    for (const key of Object.keys(document.$extensions)) if (key !== EXTENSION) throw new Error(`Unknown DTCG extension "${key}"`);
  }
  for (const [family, roles] of Object.entries(document)) {
    if (family.startsWith('$')) continue;
    if (!roles || typeof roles !== 'object') throw new Error(`Invalid DTCG group "${family}"`);
    for (const [role, entry] of Object.entries(roles)) {
      if (!entry || typeof entry !== 'object' || !('$value' in entry)) throw new Error(`Missing $value at ${family}.${role}`);
      if (entry.$type && !Object.values(TYPE_BY_FAMILY).includes(entry.$type)) throw new Error(`Unknown type "${entry.$type}"`);
      for (const property of Object.keys(entry)) if (!['$value', '$type', '$description'].includes(property)) throw new Error(`Unknown DTCG property "${property}"`);
    }
  }
  const ext = document.$extensions?.[EXTENSION];
  if (ext?.formatVersion !== DTCG_VERSION) throw new Error(`Unsupported DTCG version; expected ${DTCG_VERSION}`);
}

export function generateDtcg(themeMap, { selectors = {}, sourceRevision = null } = {}) {
  const names = Object.keys(themeMap).sort();
  if (!names.length) throw new Error('At least one theme is required');
  const first = sortedTokenObject(themeMap[names[0]]);
  const themes = {};
  for (const name of names) {
    resolvedTheme(themeMap[name]);
    themes[name] = { selector: selectors[name] ?? `[data-theme="${name}"]` };
  }
  first.$schema = 'https://tr.designtokens.org/format/2025.10';
  first.$extensions = { [EXTENSION]: { formatVersion: DTCG_VERSION, generator: 'neobrui-token-exporter/1', sourceRevision, themes } };
  return first;
}
export function exportDtcg(themeMap, options = {}) { return `${JSON.stringify(generateDtcg(themeMap, options), null, 2)}\n`; }
export function importDtcg(input) {
  const document = typeof input === 'string' ? JSON.parse(input) : clone(input);
  assertDtcgObject(document);
  const result = {};
  for (const [family, roles] of Object.entries(document)) {
    if (family.startsWith('$')) continue;
    result[family] = {};
    for (const [role, value] of Object.entries(roles)) result[family][role] = { $value: value.$value, ...(value.$type ? { $type: value.$type } : {}) };
  }
  Object.defineProperty(result, 'themes', { value: clone(document.$extensions?.[EXTENSION]?.themes ?? {}), enumerable: false });
  return result;
}
export function roundTripDtcg(input) {
  const imported = importDtcg(input);
  const themes = imported.themes && Object.keys(imported.themes).length ? imported.themes : { imported: {} };
  const result = {};
  for (const name of Object.keys(themes)) result[name] = imported;
  return exportDtcg(result, { selectors: Object.fromEntries(Object.entries(themes).map(([name, value]) => [name, value.selector])) });
}
export function generateThemeManifest(themeMap, { selectors = {} } = {}) {
  const themes = {};
  for (const name of Object.keys(themeMap).sort()) themes[name] = { selector: selectors[name] ?? `[data-theme="${name}"]` };
  return { version: 1, formatVersion: DTCG_VERSION, themes };
}
export function manifestHash(manifest) { return createHash('sha256').update(`${JSON.stringify(manifest)}\n`).digest('hex'); }
export function resolveTheme(tokens) { return resolvedTheme(tokens); }
export { generateCss } from './tokens.mjs';
export { REQUIRED_ROLES };
