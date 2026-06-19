import type { Chord } from './Chord';
import type { Key } from './Key';
import type { NashvilleChord } from './NashvilleChord';
import type { SongLine } from './SongLine';

/**
 * Parsed song format. Contains meta info, song chords and blocks, ready to be transposed or printed.
 */
export interface Jsong {
  meta: {
    key: Key;
    [name: string]: string;
  };
  chords: NashvilleChord[];
  transposedChords?: Chord[];
  lines: SongLine[];
}
