# @yuhshi/tokens

The single source of design values for every Yuhshi surface: Android, iOS, web, admin and marketing.
Source of truth: **Yuhshi Master Blueprint (Consolidated Edition 1.0)**, Parts XV (Typography) and XVI (Color).
Values are locked; changing one needs owner approval.

## What's inside

| Module | Contents |
| --- | --- |
| `color` | Brand palette, fusion stops, neutrals, dark surfaces, functional states, official text colors, text-safe shades |
| `themes` | Semantic `lightTheme` / `darkTheme`: background, border, text, and `fill` / `onFill` / `text` for every brand and state color |
| `gradients` | Signature Fusion and the four secondary gradients |
| `typography` | Figtree + Noto stack, weights, locked type scale, semantic tokens (`heading.screen`, `data.currency`, …), reading mode |
| `contrast` | WCAG contrast helpers, including `bestTextOn(hue)` for personal hues |

Build output: `dist/tokens.css` (CSS custom properties, light + dark) and `dist/tokens.json`.

## Rules for every component

1. Use semantic roles (`theme.connection.text`), never raw hex.
2. Official supporting colors are for fills and graphics. Text in those colors uses the role's `text` value.
3. Text on a fill uses the role's `onFill`. On teal, coral, amber, blue, success, warning and dark-mode brand fills that is dark ink `#17192A`.
4. Destructive buttons use `state.error.solidFill` with white text.
5. `text.muted` (4.47:1 on white) is for large or nonessential text only.
6. Input and control outlines use `border.control` (≥3:1). `border.default` and `border.subtle` are decorative.
7. Gradients only for meaningful moments (onboarding, matching, milestones, Fusion Moment, wordmark i-dot).
8. Money and statistics use `data.*` tokens: tabular numerals, never oversized.
9. Layouts must work at 200% text scale with no clipping, in LTR and RTL.

## Commands

```sh
pnpm build   # compile + emit tokens.css / tokens.json
pnpm test    # locked-value and WCAG contrast tests
```

The tests fail if any locked value changes or any text role drops below WCAG AA.
