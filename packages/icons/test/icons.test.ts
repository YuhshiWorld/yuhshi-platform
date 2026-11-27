import { describe, expect, it } from 'vitest';
import { iconNames, icons, iconSvg } from '../src/index';

describe('synced Yuhshi UI icons', () => {
  it('has the full v1 set', () => expect(iconNames.length).toBeGreaterThanOrEqual(66));
  it('every icon uses currentColor only', () => {
    for (const n of iconNames) expect(icons[n].svg).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
  it('tabs have selected versions', () => {
    for (const t of ['world', 'discover', 'yuhshi', 'phrasebook', 'profile'] as const) {
      expect(iconSvg(t, true)).toContain('fill-opacity="0.16"');
    }
  });
});
