import { RELATIVE_KEYS } from '../constants';
import type { Key } from '../types/Key';
import type { MajorKey } from '../types/MajorKey';
import { isMinorKey } from './typeguards';

/**
 * Convert note or key to relative major key (3 semi-tones up).
 * @param key
 * @example toRelativeMajor('Em') -> 'G'
 * @returns relative major key as {@link MajorKey}.
 */
export const toRelativeMajor = (key: Key) => {
  if (!isMinorKey(key)) return key;
  return RELATIVE_KEYS[key];
};
