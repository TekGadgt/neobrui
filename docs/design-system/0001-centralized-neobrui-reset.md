# ADR 0001: Centralized Neobrui design-system reset

- Status: accepted
- Date: 2026-08-27
- Authority: `charter.md` and `charter.json` in this directory

## Context

Neobrui is a public, opt-in Neobrutalism design system. The prior private-alpha/CUBE implementation, generated token pipeline, and docs showcase are evidence only, not a compatibility contract. The approved design-language charter is reproduced here as the stable source of truth.

## Decisions

1. Use hybrid semantic names: `.nbr-stack`, `.nbr-cluster`, `.nbr-wrapper`, `.nbr-grid`, `.nbr-surface`, and `.nbr-pressable`; reserve `.nbr-u-*` for true utilities.
2. Ship Surface and Pressable as the v0 primitives. Defer Field until two real forms demonstrate a coordinated repeated need.
3. Use safe neutral semantic fallbacks. Products override roles; core does not require a house yellow/pink/blue palette.
4. Use logical down-and-inline-end shadows by default, with `[data-nbr-shadow-direction="fixed"]` as a physical escape. Border, shadow, and press geometry are semantic custom properties and tunable. Defaults are conservative: 2px structural/control border, 2px small shadow offset, 4px raised offset, and 2px press translation. Forced colors preserve boundaries without shadows.
5. Keep repository-owned AI guidance in `skills/neobrui/` with references and templates; do not install or duplicate it in Hermes profiles.
6. Make one clean breaking migration. Do not add compatibility aliases. Archive only decision-worthy history and delete obsolete generated/custom machinery.

## Consequences

The package is directly authored CSS with no runtime JavaScript, generated token authority, reset, bare-element styles, utility matrix, `!important`, or Tailwind adapter. Native HTML owns semantics and behavior. Documentation demonstrates the opt-in API and accessible themes while retaining the maintained Starlight shell.

## Provenance

The approved charter artifacts were copied from parent task `t_98af6b00` attachments without modification. SHA-256:

- `charter.md`: `5d4d43896c11794ccc6a4139be5419b0e5fb1e6e109d100cd4d1ceb6824aa3f4`
- `charter.json`: `c32fad862b71a46dc7131847d767bed8565a981758dfda030dd26c140a948b5c`
