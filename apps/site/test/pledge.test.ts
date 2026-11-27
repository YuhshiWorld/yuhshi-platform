import { describe, expect, it } from 'vitest';
import { validatePledge } from '../lib/pledge';

describe('pledge validation', () => {
  it('accepts a valid pledge and normalises it', () => {
    expect(validatePledge({ email: ' Ama@Example.com ', country: 'cm', consent: true })).toEqual({
      ok: true,
      pledge: { email: 'ama@example.com', country: 'CM', waitlist: true },
    });
  });
  it('explains a bad email', () => {
    const r = validatePledge({ email: 'nope', country: 'CM', consent: true });
    expect(r).toMatchObject({ ok: false, field: 'email' });
  });
  it('accepts only the 195 register countries', () => {
    expect(validatePledge({ email: 'a@b.co', country: 'XX', consent: true })).toMatchObject({ ok: false, field: 'country' });
    expect(validatePledge({ email: 'a@b.co', country: 'VA', consent: true })).toMatchObject({ ok: true });
  });
  it('requires consent before any email', () => {
    expect(validatePledge({ email: 'a@b.co', country: 'NG' })).toMatchObject({ ok: false, field: 'consent' });
  });
});
