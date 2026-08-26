// Product-owned theme selector configuration for the neutral fixture.
// Neobrui consumes this mapping; it does not own theme state or toggles.
export const themeSelectors = Object.freeze(Object.fromEntries([
  ['personal-light', '[data-theme="personal-light"]'],
  ['personal-dark', '[data-theme="personal-dark"]'],
  ['workshop', '[data-theme="workshop"]'],
  ['nested-theme', '[data-theme="nested-theme"]'],
  ['neutralized', '[data-theme="neutralized"]'],
]));
