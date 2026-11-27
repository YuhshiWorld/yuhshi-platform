/**
 * Pure styling and behaviour rules for components. Kept separate from rendering
 * so every rule (contrast, labels, sizes) is unit-tested.
 */
import { bestTextOn, contrastRatio, maxFontScale, touchTarget, type ColorTheme } from '@yuhshi/tokens';
import type { IconName } from '@yuhshi/icons';

// ---------- Buttons ----------

export type ButtonVariant = 'primary' | 'secondary' | 'connection' | 'ghost' | 'destructive';
export type ButtonSize = 'md' | 'sm';

export interface ButtonColors {
  background: string;
  text: string;
  border: string;
}

export function buttonColors(c: ColorTheme, variant: ButtonVariant): ButtonColors {
  switch (variant) {
    case 'primary':
      return { background: c.brand.fill, text: c.brand.onFill, border: c.brand.fill };
    case 'connection':
      return { background: c.connection.fill, text: c.connection.onFill, border: c.connection.fill };
    case 'destructive':
      return { background: c.state.error.solidFill, text: c.state.error.onFill, border: c.state.error.solidFill };
    case 'secondary':
      return { background: 'transparent', text: c.brand.text, border: c.border.control };
    case 'ghost':
      return { background: 'transparent', text: c.brand.text, border: 'transparent' };
  }
}

/** Height per size; both meet the minimum touch target. */
export const buttonHeight: Record<ButtonSize, number> = { md: touchTarget.comfortable, sm: touchTarget.min };

/** Contrast of a button's text against what is actually behind it. */
export function buttonContrast(c: ColorTheme, variant: ButtonVariant): number {
  const col = buttonColors(c, variant);
  const behind = col.background === 'transparent' ? c.background.main : col.background;
  return contrastRatio(col.text, behind);
}

// ---------- Sync status (honest statuses, postcard language E7) ----------

export type SyncState = 'saved-locally' | 'on-its-way' | 'submitted' | 'delivered' | 'failed' | 'needs-attention';
export type StatusTone = 'neutral' | 'info' | 'success' | 'error' | 'warning';

export interface SyncSpec {
  icon: IconName;
  label: string;
  tone: StatusTone;
  /** Final only after server confirmation (Blueprint §12.12). */
  final: boolean;
}

export const syncSpecs: Record<SyncState, SyncSpec> = {
  'saved-locally': { icon: 'saved-locally', label: 'Saved on this phone', tone: 'neutral', final: false },
  'on-its-way': { icon: 'on-its-way', label: 'Your postcard is on its way', tone: 'info', final: false },
  submitted: { icon: 'pending', label: 'Submitted', tone: 'info', final: false },
  delivered: { icon: 'delivered', label: 'Delivered', tone: 'success', final: true },
  failed: { icon: 'failed', label: "Couldn't send. Tap to try again", tone: 'error', final: true },
  'needs-attention': { icon: 'failed', label: 'Needs your attention', tone: 'warning', final: false },
};

export function toneTextColor(c: ColorTheme, tone: StatusTone): string {
  switch (tone) {
    case 'neutral':
      return c.text.secondary;
    case 'info':
      return c.state.info.text;
    case 'success':
      return c.state.success.text;
    case 'error':
      return c.state.error.text;
    case 'warning':
      return c.state.warning.text;
  }
}

// ---------- Avatar / personal hue (E2) ----------

/** Up to two initials, script-agnostic (works for any letters, not only Latin). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  if (parts.length === 0) return '';
  const first = Array.from(parts[0]!)[0] ?? '';
  const last = parts.length > 1 ? Array.from(parts[parts.length - 1]!)[0] ?? '' : '';
  return (first + last).toLocaleUpperCase();
}

/** Text colour on a user's personal hue: whichever ink reads best. */
export function onHue(hue: string): string {
  return bestTextOn(hue, ['#17192A', '#FFFFFF']);
}

// ---------- Text scaling ----------

/** Text may grow with the user's setting up to 200% (Font Blueprint §15.7). */
export const maxFontSizeMultiplier = maxFontScale;
