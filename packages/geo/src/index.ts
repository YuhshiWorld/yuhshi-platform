import { countries, type CountryRecord } from './countries';

export * from './countries';

const byCode = new Map(countries.map((c) => [c.code, c]));

export function isCountryCode(code: string): boolean {
  return byCode.has(code.toUpperCase());
}

export function getCountry(code: string): CountryRecord | undefined {
  return byCode.get(code.toUpperCase());
}

/** The country's name in the reader's language, with the English name as fallback. */
export function countryName(code: string, locale = 'en'): string {
  const c = getCountry(code);
  if (!c) return code;
  try {
    const name = new Intl.DisplayNames([locale], { type: 'region', fallback: 'none' }).of(c.code);
    return name ?? c.englishName;
  } catch {
    return c.englishName;
  }
}

/** Flag emoji from the code; screens without flag support show the code instead. */
export function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/[A-Z]/g, (ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65));
}

/**
 * All 195 countries in alphabetical order in the reader's own language.
 * Equal value: never ranked, never ordered by size, users or revenue (bp 6, 14).
 */
export function countriesAlphabetical(locale = 'en'): Array<CountryRecord & { name: string }> {
  const collator = new Intl.Collator(locale);
  return countries
    .map((c) => ({ ...c, name: countryName(c.code, locale) }))
    .sort((a, b) => collator.compare(a.name, b.name));
}
