/**
 * Money contract. US dollars are the base currency (owner decision 2026-11-27); every price
 * is set in USD and converted per country. Amounts are integers in minor units (cents),
 * never floating point. Money decisions run on the server; devices only display.
 */
export const BASE_CURRENCY = 'USD';

export interface Money {
  /** Integer amount in the currency's minor unit (cents for USD). */
  minor: number;
  /** ISO 4217 code. */
  currency: string;
}

export function money(minor: number, currency: string = BASE_CURRENCY): Money {
  if (!Number.isSafeInteger(minor)) throw new RangeError('money must be a whole number of minor units');
  if (!/^[A-Z]{3}$/.test(currency)) throw new RangeError('currency must be an ISO 4217 code');
  return { minor, currency };
}

/** Purchasing-power price bands (Revenue & Pricing Plan, locked). */
export const priceBands = { A: 1, B: 0.6, C: 0.35, D: 0.2 } as const;
export type PriceBand = keyof typeof priceBands;

/** Band price in USD cents, rounded to the nearest .x9 ending people expect (e.g. 359 → 359, 210 → 209). */
export function bandPriceUsd(baseMinor: number, band: PriceBand): Money {
  const raw = Math.round(baseMinor * priceBands[band]);
  if (raw < 100) return money(Math.max(raw, 1));
  const charm = Math.floor(raw / 10) * 10 + 9;
  return money(charm - (charm - raw > 5 ? 10 : 0));
}

/** One side of a double-entry posting. Positive = debit, negative = credit. */
export interface LedgerLine {
  account: string;
  amount: Money;
}

/** A posting must have at least two lines and sum to zero in every currency. */
export function isBalanced(lines: readonly LedgerLine[]): boolean {
  if (lines.length < 2) return false;
  const totals = new Map<string, number>();
  for (const l of lines) {
    if (!Number.isSafeInteger(l.amount.minor) || l.amount.minor === 0) return false;
    totals.set(l.amount.currency, (totals.get(l.amount.currency) ?? 0) + l.amount.minor);
  }
  return [...totals.values()].every((t) => t === 0);
}

/**
 * Account names: `<owner>:<purpose>`, e.g. `user:usr_…:wallet`, `yuhshi:fees`,
 * `provider:escrow`. User funds come only from customers' payments (never from Yuhshi).
 */
export function accountName(owner: 'user' | 'yuhshi' | 'provider', purpose: string, ownerId?: string): string {
  return ownerId ? `${owner}:${ownerId}:${purpose}` : `${owner}:${purpose}`;
}
