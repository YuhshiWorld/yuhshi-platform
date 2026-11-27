import { validatePledge } from '../../../lib/pledge';

/**
 * Receives a pledge. Pledges are stored only once a store is connected (PLEDGE_STORE_URL):
 * until then the site says plainly that sign-ups open soon, and stores nothing.
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, field: 'form', message: 'Something went wrong. Please try again.' }, { status: 400 });
  }
  const result = validatePledge((body ?? {}) as Record<string, unknown>);
  if (!result.ok) return Response.json(result, { status: 422 });

  const store = process.env.PLEDGE_STORE_URL;
  if (!store) {
    return Response.json({ ok: false, field: 'form', open: false, message: 'Sign-ups open soon. Nothing was saved.' }, { status: 503 });
  }
  const res = await fetch(store, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...result.pledge, receivedAt: new Date().toISOString() }),
  });
  if (!res.ok) {
    return Response.json({ ok: false, field: 'form', message: 'We could not save your pledge. Please try again later.' }, { status: 502 });
  }
  return Response.json({ ok: true, country: result.pledge.country });
}
