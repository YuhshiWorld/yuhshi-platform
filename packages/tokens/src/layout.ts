/**
 * Layout tokens: spacing, radii, touch targets, motion.
 * Owner-approved 2026-11-27 (Master Blueprint §16.16): 4-point spacing grid, rounded radii,
 * 44/48 touch targets, gentle motion. Components use these names, never raw numbers.
 */

/** 4-point spacing scale, in px (web) / dp (native). */
export const space = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  giant: 64,
} as const;

/** Corner radii. Rounded, friendly corners echo the emblem and wordmark. */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/** Minimum touch target (WCAG 2.5.5 / platform guidelines). Never smaller, at any icon size. */
export const touchTarget = { min: 44, comfortable: 48 } as const;

/** Icon sizes (Yuhshi UI icons are drawn on a 24 grid). */
export const iconSize = { sm: 20, md: 24, lg: 28, xl: 32 } as const;

/** Stroke width of control borders and focus rings. */
export const borderWidth = { hairline: 1, control: 1.5, focus: 2 } as const;

/**
 * Motion durations in ms. With reduced motion on, use `motion.reduced` (0)
 * for decorative movement; essential state changes cross-fade instead of moving.
 */
export const motion = {
  instant: 0,
  fast: 120,
  standard: 200,
  emphasized: 320,
  /** Fusion Moment and passport milestones only (E3). */
  celebration: 900,
  reduced: 0,
} as const;
