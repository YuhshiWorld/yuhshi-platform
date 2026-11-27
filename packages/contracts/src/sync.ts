/**
 * Offline-first sync contract (Blueprint §12, E7). Every action is saved on the device first,
 * queued in the outbox as an operation with its own ID, and sent when a connection allows.
 * The server applies each operation ID once only, so retries never double anything.
 */

/** The six honest statuses, shown in postcard words (E7). Same names as `@yuhshi/ui`. */
export const syncStates = ['saved-locally', 'on-its-way', 'submitted', 'delivered', 'failed', 'needs-attention'] as const;
export type SyncState = (typeof syncStates)[number];

/** Allowed status moves. Nothing jumps to delivered without the server. */
export const syncTransitions: Record<SyncState, readonly SyncState[]> = {
  'saved-locally': ['on-its-way'],
  'on-its-way': ['submitted', 'failed', 'saved-locally'],
  submitted: ['delivered', 'failed', 'needs-attention'],
  delivered: [],
  failed: ['on-its-way', 'needs-attention'],
  'needs-attention': ['on-its-way'],
};

export function canMove(from: SyncState, to: SyncState): boolean {
  return syncTransitions[from].includes(to);
}

/** Sync order: safety and privacy first, large downloads last (Blueprint §12). */
export const syncPriorities = ['safety', 'essential', 'drafts', 'submissions', 'media', 'downloads'] as const;
export type SyncPriority = (typeof syncPriorities)[number];

export interface OutboxOperation<P = unknown> {
  /** `op_...` — doubles as the idempotency key. */
  opId: string;
  /** Event type or API operation this sends. */
  kind: string;
  priority: SyncPriority;
  payload: P;
  createdAt: string;
  attempts: number;
  state: SyncState;
  /** Earliest time to retry (ISO), set after a failure. */
  retryAfter?: string;
}

/** Queue order: priority first, then oldest first. */
export function compareOutbox(a: OutboxOperation, b: OutboxOperation): number {
  const p = syncPriorities.indexOf(a.priority) - syncPriorities.indexOf(b.priority);
  return p !== 0 ? p : a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
}

/** Retry delay with a ceiling: 2s, 4s, 8s … up to 15 minutes. */
export function retryDelayMs(attempts: number): number {
  return Math.min(2000 * 2 ** Math.max(0, attempts - 1), 15 * 60 * 1000);
}

export type ConnectionMode = 'online' | 'weak' | 'offline';

/** What may sync now: on a weak connection, media waits unless the person chose otherwise. */
export function maySyncNow(priority: SyncPriority, mode: ConnectionMode, allowMediaOnWeak = false): boolean {
  if (mode === 'offline') return false;
  if (mode === 'online') return true;
  if (priority === 'downloads') return false;
  if (priority === 'media') return allowMediaOnWeak;
  return true;
}
