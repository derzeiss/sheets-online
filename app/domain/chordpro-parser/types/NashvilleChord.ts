import type { Nashville } from './Nashville';
import type { Chord } from './Chord';

/**
 * Prosong {@link Chord} object, but only with nashville numbers.
 */
export type NashvilleChord = {
  // 1#m7/6
  name: string;
  // 1#
  root: Nashville;
  // m
  qual?: string;
  // 7
  ext?: string;
  // 6
  bass?: Nashville;
  // true if (1#m7/6)
  optional: boolean;
};
