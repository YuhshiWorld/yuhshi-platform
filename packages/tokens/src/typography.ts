/**
 * Typography tokens — Yuhshi Font Blueprint V1.0 (Master Blueprint Part XV).
 * Sizes are px on web and dp on native; both scale with the user's system text size (up to 200%).
 */

/** Figtree for Latin; Noto families for every other script (automatic fallback, §15.4). */
export const fontFamily = {
  primary: [
    'Figtree',
    'Noto Sans',
    'Noto Sans Arabic',
    'Noto Sans Hebrew',
    'Noto Sans Devanagari',
    'Noto Sans Bengali',
    'Noto Sans Tamil',
    'Noto Sans Thai',
    'Noto Sans Ethiopic',
    'Noto Sans JP',
    'Noto Sans KR',
    'Noto Sans SC',
    'Noto Sans TC',
    'system-ui',
    'sans-serif',
  ],
} as const;

/** §15.3 — 800 is reserved for rare marketing moments. */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export type Weight = (typeof fontWeight)[keyof typeof fontWeight];

export interface TypeStyle {
  fontSize: number;
  fontWeight: Weight;
  /** Unitless multiplier. */
  lineHeight: number;
  /** Tabular numerals for aligned figures (§15.10). */
  tabularNums?: boolean;
  /** Restricted use (Micro). */
  restricted?: boolean;
}

/**
 * Locked type scale (§15.2). Line heights are engineering defaults
 * (the blueprint fixes only reading mode at 1.65); pending design review.
 */
export const typeScale = {
  display: { fontSize: 44, fontWeight: 700, lineHeight: 1.15 },
  h1: { fontSize: 32, fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: 24, fontWeight: 600, lineHeight: 1.25 },
  h3: { fontSize: 20, fontWeight: 600, lineHeight: 1.3 },
  h4: { fontSize: 18, fontWeight: 600, lineHeight: 1.35 },
  bodyLarge: { fontSize: 16, fontWeight: 400, lineHeight: 1.5 },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
  label: { fontSize: 13, fontWeight: 500, lineHeight: 1.35 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
  micro: { fontSize: 11, fontWeight: 500, lineHeight: 1.4, restricted: true },
} as const satisfies Record<string, TypeStyle>;

/** Display range 40–48 (§15.2): pick by viewport. */
export const displayRange = { min: 40, max: 48 } as const;

/** Semantic tokens (§15.5). Components use these, never the raw scale. */
export const typography = {
  'display.hero': typeScale.display,
  'heading.screen': typeScale.h1,
  'heading.section': typeScale.h2,
  'heading.card': typeScale.h3,
  'body.primary': typeScale.bodyLarge,
  'body.secondary': typeScale.body,
  /** Reading mode §15.6: 16–18, line height 1.65. Default 17, user-adjustable. */
  'body.reading': { fontSize: 17, fontWeight: 400, lineHeight: 1.65 },
  'message.chat': typeScale.bodyLarge,
  'label.control': typeScale.label,
  'label.navigation': typeScale.label,
  /**
   * Button labels (owner-approved 2026-11-27): 16/600, small buttons 14/600.
   * label.control (13/500) stays for other controls such as input labels.
   */
  'label.button': { fontSize: 16, fontWeight: 600, lineHeight: 1.25 },
  'label.buttonSmall': { fontSize: 14, fontWeight: 600, lineHeight: 1.25 },
  'meta.timestamp': typeScale.caption,
  'meta.footnote': typeScale.caption,
  'data.value': { fontSize: 16, fontWeight: 600, lineHeight: 1.4, tabularNums: true },
  /** Deliberately not oversized (§15.10: no manipulative earning/spending typography). */
  'data.currency': { fontSize: 16, fontWeight: 600, lineHeight: 1.4, tabularNums: true },
} as const satisfies Record<string, TypeStyle>;

export type TypographyToken = keyof typeof typography;

/** Reading mode bounds (§15.6). */
export const readingMode = { minSize: 16, maxSize: 18, lineHeight: 1.65 } as const;

/** Maximum supported system text scaling (§15.7). Layouts must not clip at this scale. */
export const maxFontScale = 2;
