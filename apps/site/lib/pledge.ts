import { isCountryCode } from '@yuhshi/geo';

/** A pledge: one email asking for Yuhshi in one country, and whether it should join the waitlist. */
export interface Pledge {
  email: string;
  country: string;
  waitlist: boolean;
}

export type PledgeResult =
  | { ok: true; pledge: Pledge }
  | { ok: false; field: 'email' | 'country' | 'consent'; message: string };

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,63}$/;

/**
 * Validates a pledge. Messages say where, why and how to fix (Framework V1, screen quality).
 * Consent is required: we only email people who asked us to.
 */
export function validatePledge(input: { email?: unknown; country?: unknown; consent?: unknown }): PledgeResult {
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const country = typeof input.country === 'string' ? input.country.trim().toUpperCase() : '';
  if (!EMAIL.test(email)) {
    return { ok: false, field: 'email', message: 'Enter an email address like name@example.com.' };
  }
  if (!isCountryCode(country)) {
    return { ok: false, field: 'country', message: 'Choose your country from the list.' };
  }
  if (input.consent !== true && input.consent !== 'on' && input.consent !== 'true') {
    return { ok: false, field: 'consent', message: 'Tick the box so we can email you when Yuhshi opens.' };
  }
  return { ok: true, pledge: { email, country, waitlist: true } };
}
