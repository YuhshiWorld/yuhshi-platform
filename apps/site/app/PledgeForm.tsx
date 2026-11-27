'use client';

import { useId, useState, type FormEvent } from 'react';

interface Props {
  countries: Array<{ code: string; name: string; flag: string }>;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'done'; country: string }
  | { kind: 'notOpen' }
  | { kind: 'error'; field: string; message: string };

export function PledgeForm({ countries }: Props) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/pledge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: data.get('email'), country: data.get('country'), consent: data.get('consent') === 'on' }),
      });
      const json = (await res.json()) as { ok: boolean; country?: string; field?: string; message?: string; open?: boolean };
      if (json.ok) setStatus({ kind: 'done', country: json.country ?? '' });
      else if (json.open === false) setStatus({ kind: 'notOpen' });
      else setStatus({ kind: 'error', field: json.field ?? 'form', message: json.message ?? 'Please try again.' });
    } catch {
      setStatus({ kind: 'error', field: 'form', message: 'You seem to be offline. Your details were not sent; please try again when connected.' });
    }
  }

  if (status.kind === 'done') {
    const name = countries.find((c) => c.code === status.country)?.name ?? status.country;
    return (
      <p className="notice success" role="status">
        Your pledge for {name} is in. We will email you when Yuhshi opens there.
      </p>
    );
  }

  const err = status.kind === 'error' ? status : null;
  return (
    <form className="pledge" onSubmit={onSubmit} noValidate aria-describedby={`${id}-status`}>
      <div className="field">
        <label htmlFor={`${id}-country`}>Your country</label>
        <select id={`${id}-country`} name="country" required defaultValue="" aria-invalid={err?.field === 'country'}>
          <option value="" disabled>
            Choose your country
          </option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
        {err?.field === 'country' && <p className="error">{err.message}</p>}
      </div>
      <div className="field">
        <label htmlFor={`${id}-email`}>Email</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" placeholder="name@example.com" required aria-invalid={err?.field === 'email'} />
        {err?.field === 'email' && <p className="error">{err.message}</p>}
      </div>
      <label className="check">
        <input type="checkbox" name="consent" required />
        <span>Email me when Yuhshi opens in my country. No other emails, and I can stop at any time.</span>
      </label>
      {err?.field === 'consent' && <p className="error">{err.message}</p>}
      <button type="submit" className="primary" disabled={status.kind === 'sending'} aria-busy={status.kind === 'sending'}>
        {status.kind === 'sending' ? 'Sending…' : 'Bring Yuhshi to my country'}
      </button>
      <div id={`${id}-status`} aria-live="polite">
        {status.kind === 'notOpen' && <p className="notice">Sign-ups open soon. Nothing was saved yet; please come back shortly.</p>}
        {err?.field === 'form' && <p className="error">{err.message}</p>}
      </div>
    </form>
  );
}
