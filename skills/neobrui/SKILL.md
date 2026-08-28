---
name: neobrui
description: Use when an explicit Neobrui or Ryan design-language brief requests the centralized opt-in system.
---

# Neobrui

Use the repository's direct CSS API and preserve native HTML semantics. Project identity and the explicit brief take precedence, followed by accessibility/native semantics, Neobrui principles, and recipes.

- Import `neobrui` or an explicit subpath; do not add a reset.
- Use `.nbr-stack`, `.nbr-cluster`, `.nbr-wrapper`, and `.nbr-grid` for layout.
- Use `.nbr-surface` with `data-nbr-level="quiet|outlined|raised"` and `.nbr-pressable` on native buttons or links.
- Use `.nbr-u-visually-hidden` only for visually hidden accessible content.
- Keep tokens semantic and product-owned; tune geometry through custom properties.
- Never invent `.nbr-button`, `.nbr-field`, broad utility matrices, runtime JS, or compatibility aliases.

See `references/api.md` for the contract and `references/examples.md` for good/bad examples. Use `templates/verification.md` for release evidence.
