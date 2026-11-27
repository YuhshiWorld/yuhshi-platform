/**
 * API contract shared by apps, site and backend. Every error tells people where, why and
 * how to fix it (Framework V1, screen quality), in plain words a screen can show as is.
 */
export const API_VERSION = '2026-11-27';

export const headers = {
  /** The outbox operation ID; the server applies an operation once only. */
  idempotencyKey: 'Idempotency-Key',
  apiVersion: 'Yuhshi-Api-Version',
  /** BCP 47 language for messages, e.g. fr-CM. */
  language: 'Accept-Language',
} as const;

export const errorCodes = {
  invalid: { status: 422, retryable: false },
  unauthenticated: { status: 401, retryable: false },
  forbidden: { status: 403, retryable: false },
  notFound: { status: 404, retryable: false },
  conflict: { status: 409, retryable: false },
  rateLimited: { status: 429, retryable: true },
  notOpenHere: { status: 451, retryable: false },
  unavailable: { status: 503, retryable: true },
  internal: { status: 500, retryable: true },
} as const;
export type ErrorCode = keyof typeof errorCodes;

export interface ApiError {
  ok: false;
  code: ErrorCode;
  /** Plain words for the person, in their language. */
  message: string;
  /** Form field the error is about, if any. */
  field?: string;
  retryable: boolean;
  /** Seconds to wait before retrying, for rateLimited and unavailable. */
  retryAfter?: number;
}

export type ApiResult<T> = ({ ok: true } & T) | ApiError;

export function apiError(code: ErrorCode, message: string, extra: { field?: string; retryAfter?: number } = {}): ApiError {
  return { ok: false, code, message, retryable: errorCodes[code].retryable, ...extra };
}

/** Lists are paged with an opaque cursor, never page numbers (stable while data changes). */
export interface Page<T> {
  items: T[];
  next: string | null;
}

/** Countries that are not open yet answer `notOpenHere` and show the pledge, never a dead end. */
export interface CountryAvailability {
  country: string;
  open: boolean;
  /** Features held back in this country by law, with the reason shown to people. */
  limits: Array<{ feature: string; reason: string }>;
}
