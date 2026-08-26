// Copy into a personal project; selectors and token meaning remain product-owned.
import { exportDtcg } from '../src/tokens/dtcg.mjs';

export const selectors = Object.freeze({
  light: '.my-product[data-theme="light"]',
  dark: '.my-product[data-theme="dark"]',
});

export function buildInterchange(themes) {
  return exportDtcg(themes, { selectors });
}
