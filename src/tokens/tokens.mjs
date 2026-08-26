import { flattenTokens, validateTokens } from './schema.mjs';

export function generateCss(themeMap) {
  if (!themeMap || typeof themeMap !== 'object') throw new TypeError('A fixture-owned theme map is required');
  const themes = Object.entries(themeMap).map(([name, tokens]) => {
    const errors = validateTokens(tokens);
    if (errors.length) throw new Error(`${name}: ${errors.join('; ')}`);
    const lines = flattenTokens(tokens).map(([key, value]) => `  --_nb-${key.replace('.', '-')} : ${value};`.replace(' :', ':'));
    return `[data-_nb-theme="${name}"] {\n${lines.join('\n')}\n}`;
  }).join('\n\n');
  return `@layer neobrui.tokens {\n${themes}\n}\n`;
}
