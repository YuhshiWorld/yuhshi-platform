import { describe, expect, it } from 'vitest';
import {
  AA, bestTextOn, brand, contrastRatio, darkTheme, lightTheme, textSafe, typography, typeScale,
  type ColorTheme,
} from '../src/index.js';

const surfaces = (t: ColorTheme) => [t.background.main, t.background.secondary, t.background.card];

describe('locked blueprint values', () => {
  it('keeps the official brand palette', () => {
    expect(brand).toEqual({
      spirit: '#5141D7', human: '#20C6B2', pulse: '#FF705E',
      horizon: '#F5B942', orbit: '#4389F5', universe: '#25283A',
    });
  });
  it('keeps the official text colors (§15.8)', () => {
    expect(lightTheme.text).toEqual({ primary: '#17192A', secondary: '#555B6E', muted: '#70778A', link: '#5141D7' });
    expect(darkTheme.text).toEqual({ primary: '#F7F8FC', secondary: '#B6BCD0', muted: '#929AB2', link: '#A69AFF' });
  });
  it('keeps the locked type scale (§15.2)', () => {
    expect(Object.values(typeScale).map((s) => [s.fontSize, s.fontWeight])).toEqual([
      [44, 700], [32, 700], [24, 600], [20, 600], [18, 600], [16, 400], [14, 400], [13, 500], [12, 400], [11, 500],
    ]);
  });
  it('uses tabular numerals for data tokens and never oversizes currency', () => {
    expect(typography['data.value'].tabularNums).toBe(true);
    expect(typography['data.currency'].tabularNums).toBe(true);
    expect(typography['data.currency'].fontSize).toBeLessThanOrEqual(typography['body.primary'].fontSize);
  });
  it('reading mode is 16–18 at line height 1.65 (§15.6)', () => {
    const r = typography['body.reading'];
    expect(r.fontSize).toBeGreaterThanOrEqual(16);
    expect(r.fontSize).toBeLessThanOrEqual(18);
    expect(r.lineHeight).toBe(1.65);
  });
});

describe.each([lightTheme, darkTheme])('$name theme accessibility (WCAG AA)', (t) => {
  it('primary, secondary and link text pass 4.5:1 on every surface', () => {
    for (const bg of surfaces(t)) {
      for (const fg of [t.text.primary, t.text.secondary, t.text.link]) {
        expect(contrastRatio(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(AA.normalText);
      }
    }
  });
  it('muted text passes at least 3:1 (large or nonessential text only)', () => {
    for (const bg of surfaces(t)) expect(contrastRatio(t.text.muted, bg)).toBeGreaterThanOrEqual(AA.largeText);
  });
  it('every colored text role passes 4.5:1 on every surface', () => {
    const roles = [t.brand, t.connection, t.pulse, t.horizon, t.orbit, ...Object.values(t.state)];
    for (const bg of surfaces(t)) for (const r of roles) {
      expect(contrastRatio(r.text, bg), `${r.text} on ${bg}`).toBeGreaterThanOrEqual(AA.normalText);
    }
  });
  it('text on every fill passes 4.5:1', () => {
    const roles = [t.brand, t.connection, t.pulse, t.horizon, t.orbit, t.state.success, t.state.warning, t.state.info];
    for (const r of roles) expect(contrastRatio(r.onFill, r.fill), `${r.onFill} on ${r.fill}`).toBeGreaterThanOrEqual(AA.normalText);
    expect(contrastRatio(t.state.error.onFill, t.state.error.solidFill)).toBeGreaterThanOrEqual(AA.normalText);
  });
  it('control borders pass 3:1 for meaningful UI boundaries', () => {
    for (const bg of surfaces(t)) expect(contrastRatio(t.border.control, bg)).toBeGreaterThanOrEqual(AA.uiGraphics);
  });
});

describe('text-safe shades (§16.10)', () => {
  it('light shades pass 4.5:1 on white and soft canvas', () => {
    for (const c of Object.values(textSafe.light)) {
      expect(contrastRatio(c, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c, '#F6F7FB')).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('dark shades pass 4.5:1 on every dark surface', () => {
    for (const c of Object.values(textSafe.dark)) for (const bg of ['#171923', '#222534', '#272A3B']) {
      expect(contrastRatio(c, bg), `${c} on ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('personal hue support (E2)', () => {
  it('bestTextOn picks a readable text color for any hue', () => {
    for (const hue of ['#5141D7', '#20C6B2', '#F5B942', '#FF705E', '#4389F5', '#7860E8']) {
      expect(contrastRatio(bestTextOn(hue), hue)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
