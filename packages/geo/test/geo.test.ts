import { describe, expect, it } from 'vitest';
import { countries, countriesAlphabetical, countryFlag, countryName, isCountryCode } from '../src/index';

describe('country register', () => {
  it('holds exactly 195 countries: 193 UN members and 2 observers', () => {
    expect(countries).toHaveLength(195);
    expect(countries.filter((c) => c.unStatus === 'member')).toHaveLength(193);
    expect(countries.filter((c) => c.unStatus === 'observer').map((c) => c.code).sort()).toEqual(['PS', 'VA']);
  });
  it('uses unique ISO alpha-2 codes', () => {
    const codes = countries.map((c) => c.code);
    expect(new Set(codes).size).toBe(195);
    for (const c of codes) expect(c).toMatch(/^[A-Z]{2}$/);
  });
  it('validates codes case-insensitively', () => {
    expect(isCountryCode('cm')).toBe(true);
    expect(isCountryCode('XX')).toBe(false);
  });
  it('names countries in the reader language', () => {
    expect(countryName('CM', 'en')).toBe('Cameroon');
    expect(countryName('CM', 'fr')).toBe('Cameroun');
  });
  it('orders alphabetically in the reader language, never by rank', () => {
    const en = countriesAlphabetical('en');
    expect(en).toHaveLength(195);
    const names = en.map((c) => c.name);
    expect([...names].sort(new Intl.Collator('en').compare)).toEqual(names);
  });
  it('makes flag emoji from codes', () => {
    expect(countryFlag('NG')).toBe('🇳🇬');
  });
});
