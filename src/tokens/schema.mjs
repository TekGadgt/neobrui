export const REQUIRED_ROLES = Object.freeze({
  color: ['canvas', 'surface', 'surfaceRaised', 'text', 'textMuted', 'onAction', 'border', 'shadow', 'action', 'focus', 'positive', 'negative'],
  border: ['control', 'region'],
  radius: ['control'],
  shadow: ['inline', 'block', 'pressInline', 'pressBlock'],
  space: ['1', '2', '3', '4', '5', '6'],
  control: ['padInline', 'padBlock'],
  region: ['gap'],
  font: ['body', 'display', 'mono'],
  text: ['body', 'label', 'heading'],
  motion: ['pressDuration'],
  focus: ['width', 'offset'],
  surface: ['background', 'border', 'shadow'],
  button: ['background'],
  field: ['background'],
});

const forbidden = /(?:yellow|blue|green|purple|pink|editor|preview|creator|takeaway|portfolio|brand|project)/i;

export function validateTokens(tokens) {
  const errors = [];
  for (const family of Object.keys(tokens)) {
    if (!Object.hasOwn(REQUIRED_ROLES, family)) {
      errors.push(`Unknown token family "${family}"`);
      continue;
    }
    if (!tokens[family] || typeof tokens[family] !== 'object' || Array.isArray(tokens[family])) {
      errors.push(`Invalid token family "${family}"`);
      continue;
    }
    for (const role of Object.keys(tokens[family])) {
      if (!REQUIRED_ROLES[family].includes(role)) errors.push(`Unknown token role "${family}.${role}"`);
    }
  }
  for (const [family, roles] of Object.entries(REQUIRED_ROLES)) {
    if (!tokens[family] || typeof tokens[family] !== 'object' || Array.isArray(tokens[family])) {
      errors.push(`Missing required token family "${family}"`);
      continue;
    }
    for (const role of roles) {
      const value = tokens[family][role];
      if (typeof value !== 'string' || value.trim() === '') errors.push(`Missing or invalid required role "${family}.${role}"`);
      if (forbidden.test(role)) errors.push(`Forbidden project/application name in core role "${family}.${role}"`);
    }
  }
  return errors;
}

export function flattenTokens(tokens) {
  return Object.entries(tokens).flatMap(([family, roles]) => Object.entries(roles).map(([role, value]) => [`${family}.${role}`, value]));
}
