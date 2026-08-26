import { flattenTokens, validateTokens } from './schema.mjs';

const RESERVED_SEGMENTS = new Set(['tokens', 'compositions', 'utilities', 'blocks', 'exceptions']);

export function normalizeTokenPath(path) {
  const segments = path.split(/[./]/).map((segment) => segment
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

export function generateCss(themeMap) {
  if (!themeMap || typeof themeMap !== 'object') throw new TypeError('A fixture-owned theme map is required');
  const themes = Object.entries(themeMap).map(([name, tokens]) => {
    const errors = validateTokens(tokens);
    if (errors.length) throw new Error(`${name}: ${errors.join('; ')}`);
    const seen = new Set();
    const lines = flattenTokens(tokens).map(([key, value]) => {
      const normalized = normalizeTokenPath(key);
      if (seen.has(normalized)) throw new Error(`Token path collision after normalization "${key}"`);
      seen.add(normalized);
      return `  --nbr-${normalized}: ${value};`;
    });
    return `[data-theme="${name}"] {\n${lines.join('\n')}\n}`;
  }).join('\n\n');
  return `@layer nbr.tokens, nbr.compositions, nbr.utilities, nbr.blocks, nbr.exceptions;\n@layer nbr.tokens {\n${themes}\n}\n`;
}
