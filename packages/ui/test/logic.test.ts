import { describe, expect, it } from 'vitest';
import { darkTheme, lightTheme, contrastRatio, touchTarget } from '@yuhshi/tokens';
import { iconNames } from '@yuhshi/icons';
import {
  buttonColors, buttonContrast, buttonHeight, initials, onHue, resolveScheme, syncSpecs, toneTextColor,
  type ButtonVariant, type SyncState,
} from '../src';

const variants: ButtonVariant[] = ['primary', 'secondary', 'connection', 'ghost', 'destructive'];

describe.each([lightTheme, darkTheme])('buttons in $name theme', (t) => {
  it.each(variants)('%s label passes WCAG AA (4.5:1)', (v) => {
    expect(buttonContrast(t, v)).toBeGreaterThanOrEqual(4.5);
  });
  it('secondary outline is a visible control boundary (3:1)', () => {
    expect(contrastRatio(buttonColors(t, 'secondary').border, t.background.main)).toBeGreaterThanOrEqual(3);
  });
});

describe('touch targets', () => {
  it('every button size is at least 44', () => {
    for (const h of Object.values(buttonHeight)) expect(h).toBeGreaterThanOrEqual(touchTarget.min);
  });
});

describe('sync status (honest statuses)', () => {
  const states = Object.keys(syncSpecs) as SyncState[];
  it('every state has an existing icon and words', () => {
    for (const s of states) {
      expect(iconNames).toContain(syncSpecs[s].icon);
      expect(syncSpecs[s].label.length).toBeGreaterThan(3);
    }
  });
  it('only Delivered and Failed are final; nothing local claims to be delivered', () => {
    expect(states.filter((s) => syncSpecs[s].final).sort()).toEqual(['delivered', 'failed']);
    expect(syncSpecs['saved-locally'].label.toLowerCase()).not.toContain('deliver');
  });
  it('status text colours pass 4.5:1 in both themes', () => {
    for (const t of [lightTheme, darkTheme]) for (const s of states) {
      expect(contrastRatio(toneTextColor(t, syncSpecs[s].tone), t.background.main), `${t.name} ${s}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('avatars and personal hue', () => {
  it('makes initials for any script', () => {
    expect(initials('Amara Nwosu')).toBe('AN');
    expect(initials('  kofi ')).toBe('K');
    expect(initials('Мария Иванова')).toBe('МИ');
    expect(initials('أحمد علي')).toBe('أع');
    expect(initials('')).toBe('');
  });
  it('text on any brand hue is readable', () => {
    for (const hue of ['#5141D7', '#20C6B2', '#FF705E', '#F5B942', '#4389F5', '#25283A']) {
      expect(contrastRatio(onHue(hue), hue)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('theme preference', () => {
  it('follows the system unless the user chooses', () => {
    expect(resolveScheme('system', 'dark')).toBe('dark');
    expect(resolveScheme('system', null)).toBe('light');
    expect(resolveScheme('light', 'dark')).toBe('light');
    expect(resolveScheme('dark', 'light')).toBe('dark');
  });
});
