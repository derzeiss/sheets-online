import { isMinorKey } from './typeguards';
import type { Key } from '../types/Key';
import type { MajorKey } from '../types/MajorKey';
import type { MinorKey } from '../types/MinorKey';

/**
 * Get parallel key.
 * @param key
 * @example toParallelKey('C') -> 'Cm'
 * @returns
 */
export const toParallelKey = <T extends Key>(
  key: T,
): T extends MajorKey ? MinorKey : MajorKey => {
  if (isMinorKey(key))
    return key.substring(0, key.length - 1) as T extends MajorKey
      ? MinorKey
      : MajorKey;
  return (key + 'm') as T extends MajorKey ? MinorKey : MajorKey;
};
