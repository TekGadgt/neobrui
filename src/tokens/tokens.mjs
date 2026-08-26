import { flattenTokens, validateTokens } from './schema.mjs';

const RESERVED_SEGMENTS = new Set(['tokens', 'compositions', 'utilities', 'blocks', 'exceptions']);

export function normalizeTokenPath(path) {
  if (typeof path !== 'string' || !path) throw new Error(`Invalid token path "${path}"`);
  if (/(?:^|[\\/])\.\.(?:[\\/]|$)/.test(path)) throw new Error(`Traversal in token path "${path}"`);
  const normalizedSeparators = path.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/+/, '').replace(/^\.\//, '');
  const rawSegments = normalizedSeparators.split(/[./]/);
  if (rawSegments.some((segment) => segment === '..')) throw new Error(`Traversal in token path "${path}"`);
  const segments = rawSegments.map((segment) => segment
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase());
  if (segments.some((segment) => !segment || !/^[a-z0-9-]+$/.test(segment))) {
    throw new Error(`Invalid token path "${path}"`);
  }
  if (segments.some((segment) => RESERVED_SEGMENTS.has(segment))) {
    throw new Error(`Reserved token path segment "${path}"`);
  }
  return segments.join('-');
}

function resolveValue(value, all, path, stack = []) {
  const raw = value && typeof value === 'object' && '$value' in value ? value.$value : value;
  if (typeof raw !== 'string') throw new Error(`Invalid token value "${path}"`);
  const ref = raw.match(/^\{([^{}]+)\}$/)?.[1];
  if (!ref) return raw;
  if (stack.includes(ref)) throw new Error(`Token reference cycle at "${path}"`);
  if (!all.has(ref)) throw new Error(`Unresolved token reference "${path}" -> "${ref}"`);
  return resolveValue(all.get(ref), all, ref, [...stack, ref]);
}

export function generateCss(themeMap, { selectors = {} } = {}) {
  if (!themeMap || typeof themeMap !== 'object') throw new TypeError('A fixture-owned theme map is required');
  const themes = Object.entries(themeMap).map(([name, tokens]) => {
    const errors = validateTokens(tokens, { allowObjects: true });
    if (errors.length) throw new Error(`${name}: ${errors.join('; ')}`);
    const seen = new Set();
    const all = new Map(flattenTokens(tokens));
    const lines = [...all.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => {
      const normalized = normalizeTokenPath(key);
      if (seen.has(normalized)) throw new Error(`Token path collision after normalization "${key}"`);
      seen.add(normalized);
      return `  --nbr-${normalized}: ${resolveValue(value, all, key)};`;
    });
    return `${selectors[name] ?? `[data-theme="${name}"]`} {\n${lines.join('\n')}\n}`;
  }).join('\n\n');
  return `@layer nbr.tokens, nbr.compositions, nbr.utilities, nbr.blocks, nbr.exceptions;\n@layer nbr.tokens {\n${themes}\n}\n`;
}
