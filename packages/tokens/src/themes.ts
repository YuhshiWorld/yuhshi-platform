/**
 * Semantic color themes. Components use these roles, never raw hex values.
 * Source: Master Blueprint §15.8, §16.8–16.10.
 */
import { brand, dark, fusion, neutral, state, text, textSafe } from './color.js';

export interface ColorTheme {
  name: 'light' | 'dark';
  background: { main: string; secondary: string; card: string };
  border: {
    /** Separators and outlines (decorative). */
    default: string;
    /** Subtle dividers. */
    subtle: string;
    /** Input and control outlines — meets 3:1 for meaningful UI boundaries. */
    control: string;
  };
  text: { primary: string; secondary: string; muted: string; link: string };
  brand: { fill: string; onFill: string; text: string };
  connection: { fill: string; onFill: string; text: string };
  pulse: { fill: string; onFill: string; text: string };
  horizon: { fill: string; onFill: string; text: string };
  orbit: { fill: string; onFill: string; text: string };
  state: {
    success: { fill: string; onFill: string; text: string };
    /** Destructive buttons use `solidFill` so white text passes 4.5:1. */
    error: { fill: string; solidFill: string; onFill: string; text: string };
    warning: { fill: string; onFill: string; text: string };
    info: { fill: string; onFill: string; text: string };
  };
  fusion: readonly [string, string, string];
}

const INK = text.light.primary; // #17192A — dark text on light fills
const WHITE = neutral.white;

export const lightTheme: ColorTheme = {
  name: 'light',
  background: { main: neutral.white, secondary: neutral.softCanvas, card: neutral.white },
  border: { default: neutral.borderGrey, subtle: neutral.cloudGrey, control: text.light.muted },
  text: { ...text.light },
  brand: { fill: brand.spirit, onFill: WHITE, text: brand.spirit },
  connection: { fill: brand.human, onFill: INK, text: textSafe.light.human },
  pulse: { fill: brand.pulse, onFill: INK, text: textSafe.light.pulse },
  horizon: { fill: brand.horizon, onFill: INK, text: textSafe.light.horizon },
  orbit: { fill: brand.orbit, onFill: INK, text: textSafe.light.orbit },
  state: {
    success: { fill: state.success, onFill: INK, text: textSafe.light.success },
    error: { fill: state.error, solidFill: textSafe.light.error, onFill: WHITE, text: textSafe.light.error },
    warning: { fill: state.warning, onFill: INK, text: textSafe.light.warning },
    info: { fill: state.info, onFill: INK, text: textSafe.light.info },
  },
  fusion: [fusion.indigo, fusion.violet, fusion.teal],
};

export const darkTheme: ColorTheme = {
  name: 'dark',
  background: { main: dark.background, secondary: dark.surface, card: dark.card },
  border: { default: dark.border, subtle: dark.border, control: text.dark.muted },
  text: { ...text.dark },
  brand: { fill: dark.brand, onFill: INK, text: text.dark.link },
  connection: { fill: brand.human, onFill: INK, text: textSafe.dark.human },
  pulse: { fill: brand.pulse, onFill: INK, text: textSafe.dark.pulse },
  horizon: { fill: brand.horizon, onFill: INK, text: textSafe.dark.horizon },
  orbit: { fill: brand.orbit, onFill: INK, text: textSafe.dark.orbit },
  state: {
    success: { fill: state.success, onFill: INK, text: textSafe.dark.success },
    error: { fill: state.error, solidFill: textSafe.light.error, onFill: WHITE, text: textSafe.dark.error },
    warning: { fill: state.warning, onFill: INK, text: textSafe.dark.warning },
    info: { fill: state.info, onFill: INK, text: textSafe.dark.info },
  },
  fusion: [fusion.indigo, fusion.violet, fusion.teal],
};

export const themes = { light: lightTheme, dark: darkTheme } as const;
