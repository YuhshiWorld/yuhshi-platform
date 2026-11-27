/** WCAG 2.x contrast utilities. Used by tests and by runtime checks for user-chosen hues. */

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Invalid hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two colors, 1–21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG AA thresholds (§16.11). */
export const AA = { normalText: 4.5, largeText: 3, uiGraphics: 3 } as const;

export function meetsAA(fg: string, bg: string, kind: keyof typeof AA = 'normalText'): boolean {
  return contrastRatio(fg, bg) >= AA[kind];
}

/** Pick whichever of the candidates reads best on a background (e.g. text on a user's personal hue). */
export function bestTextOn(bg: string, candidates: readonly string[] = ['#17192A', '#FFFFFF']): string {
  let best = candidates[0]!;
  for (const c of candidates) if (contrastRatio(c, bg) > contrastRatio(best, bg)) best = c;
  return best;
}
