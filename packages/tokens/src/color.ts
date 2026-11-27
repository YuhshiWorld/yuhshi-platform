/**
 * Yuhshi color primitives — Human Spectrum + Color Fusion.
 * Source of truth: Yuhshi Master Blueprint, Part XVI (Color) and §15.8 (Text colors).
 * Do not change values without owner approval.
 */

/** Official brand palette (§16.2). Use for fills, graphics and illustration. */
export const brand = {
  /** Yuhshi Spirit — Electric Indigo. Primary brand signature. */
  spirit: '#5141D7',
  /** Yuhshi Human — Living Teal. Connection and exchange. */
  human: '#20C6B2',
  /** Yuhshi Pulse — Warm Coral. Friendship and emotion. */
  pulse: '#FF705E',
  /** Yuhshi Horizon — Discovery Amber. Missions and discovery. */
  horizon: '#F5B942',
  /** Yuhshi Orbit — Global Blue. Languages and learning. */
  orbit: '#4389F5',
  /** Yuhshi Universe — Deep Neutral. Foundation. */
  universe: '#25283A',
} as const;

/** Signature fusion gradient stops (§16.4). */
export const fusion = {
  indigo: '#5141D7',
  violet: '#7860E8',
  teal: '#20C6B2',
} as const;

/** Neutral foundation (§16.8). */
export const neutral = {
  white: '#FFFFFF',
  softCanvas: '#F6F7FB',
  cloudGrey: '#E9ECF4',
  borderGrey: '#D5D9E5',
  mutedSlate: '#70768A',
  deepUniverse: '#25283A',
} as const;

/** Dark theme surfaces (§16.8). */
export const dark = {
  background: '#171923',
  surface: '#222534',
  card: '#272A3B',
  border: '#36394B',
  /** Brand fill in dark mode. Text on it must be #17192A (white fails contrast). */
  brand: '#8577FF',
} as const;

/** Functional state fills (§16.9). Never the only signal — pair with label or icon. */
export const state = {
  success: '#16A34A',
  error: '#DC4545',
  warning: '#E7A321',
  info: '#4389F5',
} as const;

/** Official text colors (§15.8, owner decision 2026-11-27). */
export const text = {
  light: {
    primary: '#17192A',
    secondary: '#555B6E',
    /** 4.47:1 on white — nonessential or large text only. Use `secondary` for essential small text. */
    muted: '#70778A',
    link: '#5141D7',
  },
  dark: {
    primary: '#F7F8FC',
    secondary: '#B6BCD0',
    muted: '#929AB2',
    link: '#A69AFF',
  },
} as const;

/**
 * Text-safe shades (§16.10). Use when a supporting or functional color
 * is used for text or small icons. Each meets 4.5:1 on its theme's surfaces.
 */
export const textSafe = {
  light: {
    human: '#147E71',
    pulse: '#C2412F',
    horizon: '#8F6410',
    orbit: '#2F6AD0',
    success: '#11813B',
    error: '#C93636',
    warning: '#946710',
    info: '#2F6AD0',
  },
  dark: {
    human: '#20C6B2',
    pulse: '#FF705E',
    horizon: '#F5B942',
    orbit: '#5494F6',
    success: '#17AA4D',
    error: '#E47070',
    warning: '#E7A321',
    info: '#5494F6',
  },
} as const;

export type Hex = `#${string}`;
