import { describe, expect, it } from 'vitest';
import {
  appendEvent, apiError, bandPriceUsd, canMove, canonicalJson, compareOutbox, deviceMayEmit, eventCatalog,
  idTime, isBalanced, isId, maySyncNow, money, newId, retryDelayMs, syncPriorities, syncStates, ulid, verifyChain,
  type EventEnvelope, type OutboxOperation,
} from '../src/index';

describe('ids', () => {
  it('makes sortable prefixed IDs and reads their time', () => {
    const a = newId('user', 1_700_000_000_000);
    expect(isId(a, 'user')).toBe(true);
    expect(isId(a, 'exchange')).toBe(false);
    expect(idTime(a)).toBe(1_700_000_000_000);
    expect(ulid(1, new Uint8Array(10)) < ulid(2, new Uint8Array(10))).toBe(true);
  });
  it('rejects malformed IDs', () => {
    expect(isId('usr_lowercase', 'user')).toBe(false);
    expect(isId('usr_01JD3Z8K7Q2M4N5P6R7S8T9V0W_x', 'user')).toBe(false);
  });
});

describe('event log', () => {
  const actor = { kind: 'user' as const, id: 'usr_01JD3Z8K7Q2M4N5P6R7S8T9V0W' };
  const base = { actor, subject: 'xch_01JD3Z8K7Q2M4N5P6R7S8T9V0W', occurredAt: '2026-11-27T10:00:00.000Z' };
  function chain(): EventEnvelope[] {
    const e1 = appendEvent(undefined, { ...base, id: 'evt_1', type: 'exchange.requested', payload: { mode: 'audio' } });
    const e2 = appendEvent(e1, { ...base, id: 'evt_2', type: 'exchange.accepted', payload: {} });
    const e3 = appendEvent(e2, { ...base, id: 'evt_3', type: 'exchange.completed', actor: { kind: 'server', id: 'core' }, payload: { seconds: 60 } });
    return [e1, e2, e3];
  }
  it('hashes canonically regardless of key order', () => {
    expect(canonicalJson({ b: 1, a: [1, { d: 2, c: 3 }] })).toBe('{"a":[1,{"c":3,"d":2}],"b":1}');
  });
  it('links each event to the one before', () => {
    const [e1, e2] = chain();
    expect(e1!.seq).toBe(1);
    expect(e1!.prevHash).toBe('0'.repeat(64));
    expect(e2!.prevHash).toBe(e1!.hash);
    expect(verifyChain(chain())).toEqual([]);
  });
  it('detects a quiet change', () => {
    const events = chain();
    events[1] = { ...events[1]!, payload: { sneaky: true } };
    expect(verifyChain(events)).toEqual([{ seq: 2, problem: 'hash-mismatch' }]);
  });
  it('detects a removed event', () => {
    const [e1, , e3] = chain();
    expect(verifyChain([e1!, e3!]).map((p) => p.problem)).toEqual(['broken-link', 'bad-sequence']);
  });
  it('lets devices send only device events; money and safety decisions are server-only', () => {
    expect(deviceMayEmit('report.filed')).toBe(true);
    for (const t of ['stamp.awarded', 'moderation.decided', 'payment.confirmed', 'ledger.posted', 'payout.sent', 'exchange.completed']) {
      expect(deviceMayEmit(t)).toBe(false);
    }
    expect(deviceMayEmit('made.up')).toBe(false);
    for (const spec of Object.values(eventCatalog)) if (spec.module === 'money') expect(spec.origin).toBe('server');
  });
});

describe('sync', () => {
  it('has exactly the six postcard statuses', () => {
    expect([...syncStates].sort()).toEqual(['delivered', 'failed', 'needs-attention', 'on-its-way', 'saved-locally', 'submitted']);
  });
  it('never jumps to delivered without the server', () => {
    expect(canMove('saved-locally', 'delivered')).toBe(false);
    expect(canMove('submitted', 'delivered')).toBe(true);
  });
  it('sends safety first, then oldest first', () => {
    const op = (priority: OutboxOperation['priority'], createdAt: string): OutboxOperation => ({ opId: `op_${createdAt}`, kind: 'x', priority, payload: {}, createdAt, attempts: 0, state: 'saved-locally' });
    const q = [op('media', '1'), op('safety', '3'), op('essential', '2'), op('safety', '1')].sort(compareOutbox);
    expect(q.map((o) => `${o.priority}${o.createdAt}`)).toEqual(['safety1', 'safety3', 'essential2', 'media1']);
    expect(syncPriorities[0]).toBe('safety');
  });
  it('backs off with a ceiling and holds media on weak connections', () => {
    expect(retryDelayMs(1)).toBe(2000);
    expect(retryDelayMs(50)).toBe(900000);
    expect(maySyncNow('media', 'weak')).toBe(false);
    expect(maySyncNow('safety', 'weak')).toBe(true);
    expect(maySyncNow('safety', 'offline')).toBe(false);
  });
});

describe('money', () => {
  it('uses whole minor units in USD by default', () => {
    expect(money(599)).toEqual({ minor: 599, currency: 'USD' });
    expect(() => money(5.99)).toThrow();
  });
  it('prices bands from the USD base', () => {
    expect(bandPriceUsd(599, 'A').minor).toBe(599);
    expect(bandPriceUsd(599, 'B').minor).toBe(359);
    expect(bandPriceUsd(599, 'C').minor).toBe(209);
    expect(bandPriceUsd(599, 'D').minor).toBe(119);
  });
  it('accepts only balanced postings', () => {
    expect(isBalanced([{ account: 'provider:escrow', amount: money(1000) }, { account: 'user:x:wallet', amount: money(-900) }, { account: 'yuhshi:fees', amount: money(-100) }])).toBe(true);
    expect(isBalanced([{ account: 'a', amount: money(1000) }, { account: 'b', amount: money(-999) }])).toBe(false);
    expect(isBalanced([{ account: 'a', amount: money(1000) }])).toBe(false);
  });
});

describe('api', () => {
  it('builds plain errors with retry hints', () => {
    expect(apiError('rateLimited', 'Too many tries. Wait a minute.', { retryAfter: 60 })).toEqual({ ok: false, code: 'rateLimited', message: 'Too many tries. Wait a minute.', retryable: true, retryAfter: 60 });
    expect(apiError('invalid', 'Enter an email.', { field: 'email' }).retryable).toBe(false);
  });
});
