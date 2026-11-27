/**
 * Yuhshi IDs: `<prefix>_<ULID>`, e.g. `usr_01JD3Z8K7Q2M4N5P6R7S8T9V0W`.
 * The ULID part sorts by creation time and is created on the device, so records made
 * offline already have their final ID (no renaming at sync). The prefix says what it is.
 * Countries use ISO 3166-1 alpha-2 codes (`@yuhshi/geo`), currencies ISO 4217.
 */
export const idPrefixes = {
  user: 'usr',
  device: 'dev',
  session: 'ses',
  exchange: 'xch',
  stamp: 'stp',
  message: 'msg',
  phrase: 'phr',
  report: 'rpt',
  block: 'blk',
  consent: 'cns',
  listing: 'lst',
  order: 'ord',
  payment: 'pay',
  payout: 'pyo',
  ledgerEntry: 'led',
  event: 'evt',
  operation: 'op',
  file: 'fil',
  pledge: 'plg',
} as const;

export type IdKind = keyof typeof idPrefixes;
export type IdPrefix = (typeof idPrefixes)[IdKind];
export type YuhId<K extends IdKind = IdKind> = `${(typeof idPrefixes)[K]}_${string}`;

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;

function randomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

/** A ULID: 48-bit millisecond time + 80 random bits, Crockford base32. */
export function ulid(now: number = Date.now(), random: Uint8Array = randomBytes(10)): string {
  if (!Number.isInteger(now) || now < 0 || now > 2 ** 48 - 1) throw new RangeError('time out of range');
  let time = '';
  let t = now;
  for (let i = 0; i < 10; i++) {
    time = CROCKFORD.charAt(t % 32) + time;
    t = Math.floor(t / 32);
  }
  let bits = 0n;
  for (const b of random.subarray(0, 10)) bits = (bits << 8n) | BigInt(b);
  let rand = '';
  for (let i = 0; i < 16; i++) {
    rand = CROCKFORD.charAt(Number(bits % 32n)) + rand;
    bits /= 32n;
  }
  return time + rand;
}

export function newId<K extends IdKind>(kind: K, now?: number): YuhId<K> {
  return `${idPrefixes[kind]}_${ulid(now)}` as YuhId<K>;
}

export function isId<K extends IdKind>(value: unknown, kind: K): value is YuhId<K> {
  if (typeof value !== 'string') return false;
  const [prefix, body, extra] = value.split('_');
  return prefix === idPrefixes[kind] && extra === undefined && body !== undefined && ULID_RE.test(body);
}

/** Creation time encoded in an ID, in milliseconds. */
export function idTime(id: string): number {
  const body = id.split('_')[1] ?? '';
  let t = 0;
  for (const ch of body.slice(0, 10)) t = t * 32 + CROCKFORD.indexOf(ch);
  return t;
}
