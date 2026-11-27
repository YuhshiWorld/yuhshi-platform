import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';

/**
 * The event log is Yuhshi's source of truth (Technical Architecture, Framework V1).
 * Every change is an event; each event carries the hash of the one before it, so nothing
 * changes quietly. Corrections are new events, never edits. Event types are a versioned
 * contract: changing a payload means a new version, old versions stay readable.
 *
 * `origin` says who may write it: 'device' events may come from a phone (and are re-checked
 * by the server); 'server' events are written by the server alone — moderation results,
 * stamp awards, payments and anything to do with money or safety decisions.
 */
export interface EventSpec {
  version: number;
  origin: 'device' | 'server';
  /** Area that owns the event (matches the backend module). */
  module: 'identity' | 'social' | 'safety' | 'economy' | 'money' | 'platform';
  description: string;
}

export const eventCatalog = {
  'user.registered': { version: 1, origin: 'server', module: 'identity', description: 'A new account was created.' },
  'age.signal_recorded': { version: 1, origin: 'server', module: 'identity', description: 'An age band from an age signal or check was recorded (never a birth date).' },
  'profile.updated': { version: 1, origin: 'device', module: 'identity', description: 'The person changed their own profile.' },
  'exchange.requested': { version: 1, origin: 'device', module: 'social', description: 'A person asked to start a Yuhshi (exchange).' },
  'exchange.accepted': { version: 1, origin: 'device', module: 'social', description: 'The other person said yes.' },
  'exchange.left': { version: 1, origin: 'device', module: 'social', description: 'A person left an exchange.' },
  'exchange.completed': { version: 1, origin: 'server', module: 'social', description: 'The server confirmed a qualifying exchange.' },
  'consent.given': { version: 1, origin: 'device', module: 'social', description: 'A Mutual Yes step was agreed by one person.' },
  'consent.withdrawn': { version: 1, origin: 'device', module: 'social', description: 'A person withdrew a consent.' },
  'stamp.awarded': { version: 1, origin: 'server', module: 'social', description: 'A passport stamp was awarded after validation.' },
  'phrase.saved': { version: 1, origin: 'device', module: 'social', description: 'A phrase was saved to the phrasebook.' },
  'report.filed': { version: 1, origin: 'device', module: 'safety', description: 'A person reported a person, message, exchange, listing or ad.' },
  'block.added': { version: 1, origin: 'device', module: 'safety', description: 'A person blocked someone.' },
  'moderation.decided': { version: 1, origin: 'server', module: 'safety', description: 'A moderation decision was made.' },
  'appeal.filed': { version: 1, origin: 'device', module: 'safety', description: 'A person appealed a decision.' },
  'appeal.decided': { version: 1, origin: 'server', module: 'safety', description: 'An appeal was decided by a different reviewer.' },
  'listing.published': { version: 1, origin: 'server', module: 'economy', description: 'A listing passed review and went live.' },
  'order.placed': { version: 1, origin: 'server', module: 'economy', description: 'An order was placed.' },
  'payment.confirmed': { version: 1, origin: 'server', module: 'money', description: 'The payments provider confirmed a payment.' },
  'ledger.posted': { version: 1, origin: 'server', module: 'money', description: 'A balanced double-entry posting was recorded.' },
  'payout.sent': { version: 1, origin: 'server', module: 'money', description: 'A payout left through the payments provider.' },
  'pledge.received': { version: 1, origin: 'server', module: 'platform', description: 'A Bring Yuhshi to my country pledge was received.' },
} as const satisfies Record<string, EventSpec>;

export type EventType = keyof typeof eventCatalog;

export interface Actor {
  kind: 'user' | 'server' | 'provider';
  id: string;
}

/** The shape every event has on the wire and in the log. */
export interface EventEnvelope<P = unknown> {
  id: string;
  type: EventType;
  version: number;
  /** Position in this log stream, starting at 1. */
  seq: number;
  /** When it happened, as the actor saw it (ISO 8601 UTC). */
  occurredAt: string;
  actor: Actor;
  /** Main thing the event is about (an ID). */
  subject: string;
  /** Operation ID from the device outbox; the same op is applied once only. */
  opId?: string;
  payload: P;
  /** Hash of the previous event in the stream; 64 zeros for the first. */
  prevHash: string;
  hash: string;
}

export const GENESIS_HASH = '0'.repeat(64);

/** JSON with sorted keys and no spaces, so the same event always hashes the same. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'number' && !Number.isFinite(value)) throw new TypeError('non-finite number');
    if (typeof value === 'bigint') throw new TypeError('bigint is not allowed in events; use integer minor units');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map((v) => canonicalJson(v === undefined ? null : v)).join(',')}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`;
}

export function hashEvent(event: Omit<EventEnvelope, 'hash'>): string {
  return bytesToHex(sha256(utf8ToBytes(canonicalJson(event))));
}

/** Seals an event onto the end of a stream. */
export function appendEvent<P>(
  previous: EventEnvelope | undefined,
  event: Omit<EventEnvelope<P>, 'seq' | 'prevHash' | 'hash' | 'version'> & { version?: number },
): EventEnvelope<P> {
  const spec = eventCatalog[event.type];
  const draft = {
    ...event,
    version: event.version ?? spec.version,
    seq: previous ? previous.seq + 1 : 1,
    prevHash: previous ? previous.hash : GENESIS_HASH,
  };
  return { ...draft, hash: hashEvent(draft) } as EventEnvelope<P>;
}

export type ChainProblem = { seq: number; problem: 'hash-mismatch' | 'broken-link' | 'bad-sequence' };

/** Checks a stream: every hash matches its content and links to the one before. */
export function verifyChain(events: readonly EventEnvelope[]): ChainProblem[] {
  const problems: ChainProblem[] = [];
  let prev: EventEnvelope | undefined;
  for (const e of events) {
    const { hash, ...rest } = e;
    if (hashEvent(rest) !== hash) problems.push({ seq: e.seq, problem: 'hash-mismatch' });
    if (e.prevHash !== (prev ? prev.hash : GENESIS_HASH)) problems.push({ seq: e.seq, problem: 'broken-link' });
    if (e.seq !== (prev ? prev.seq + 1 : 1)) problems.push({ seq: e.seq, problem: 'bad-sequence' });
    prev = e;
  }
  return problems;
}

/** Devices may only send device-origin events; the server rejects anything else. */
export function deviceMayEmit(type: string): boolean {
  return type in eventCatalog && eventCatalog[type as EventType].origin === 'device';
}
