import { describe, expect, it } from 'vitest';
import { syncStates } from '@yuhshi/contracts';
import { syncSpecs } from '../src/logic';

describe('sync statuses', () => {
  it('match the shared contract exactly', () => {
    expect(Object.keys(syncSpecs).sort()).toEqual([...syncStates].sort());
  });
});
