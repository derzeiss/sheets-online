import type { Key } from './types/Key';
import type { MajorKey } from './types/MajorKey';
import type { MinorKey } from './types/MinorKey';
import type { Nashville } from './types/Nashville';
import type { Note } from './types/Note';
import type { Scale } from './types/Scale';

// directives that are visible on the sheet instead of meta info
export const FORMAT_DIRECTIVES = ['comment'];
// directives that may occur multiple times in a file
export const ADDITIVE_DIRECTIVES = ['artist'];

export const NOTES_SHARP: Note[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];
export const NOTES_FLAT: Note[] = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

export const NOTES_ALL: Note[] = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
];

export const NASHVILLE_ALL: Nashville[] = [
  '1b',
  '1',
  '1#',
  '2b',
  '2',
  '2#',
  '3b',
  '3',
  '3#',
  '4b',
  '4',
  '4#',
  '5b',
  '5',
  '5#',
  '6b',
  '6',
  '6#',
  '7b',
  '7',
  '7#',
];

export const NASHVILLE_SHARP: Nashville[] = [
  '1',
  '1#',
  '2',
  '2#',
  '3',
  '4',
  '4#',
  '5',
  '5#',
  '6',
  '6#',
  '7',
];

export const NASHVILLE_FLAT: Nashville[] = [
  '1',
  '2b',
  '2',
  '3b',
  '3',
  '4',
  '5b',
  '5',
  '6b',
  '6',
  '7b',
  '7',
];

export const KEYS_ALL: Key[] = [
  'Nashville',
  // major
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
  // minor
  'Cm',
  'C#m',
  'Dbm',
  'Dm',
  'D#m',
  'Ebm',
  'Em',
  'Fm',
  'F#m',
  'Gbm',
  'Gm',
  'G#m',
  'Abm',
  'Am',
  'A#m',
  'Bbm',
  'Bm',
];

export const KEYS_FLAT: Note[] = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];

export const RELATIVE_KEYS: Record<MinorKey, MajorKey> = {
  Cm: 'Eb',
  'C#m': 'E',
  Dbm: 'E',
  Dm: 'F',
  'D#m': 'F#',
  Ebm: 'Gb',
  Em: 'G',
  Fm: 'G#',
  'F#m': 'A',
  Gbm: 'A',
  Gm: 'Bb',
  'G#m': 'B',
  Abm: 'B',
  Am: 'C',
  'A#m': 'C#',
  Bbm: 'Db',
  Bm: 'D',
};

// prettier-ignore
const eFlat: Scale = {
  "1b": "D",  1: "Eb", "1#": "E",
  "2b": "E",  2: "F",  "2#": "Gb",
  "3b": "Gb", 3: "G",  "3#": "Ab",
  "4b": "G",  4: "Ab", "4#": "A",
  "5b": "A",  5: "Bb", "5#": "B",
  "6b": "B",  6: "C",  "6#": "Db",
  "7b": "Db", 7: "D",  "7#": "Eb",
};
// prettier-ignore
const gFlat: Scale = {
  "1b": "F",  1: "Gb", "1#": "G",
  "2b": "G",  2: "Ab", "2#": "A",
  "3b": "A",  3: "Bb", "3#": "B",
  "4b": "Bb", 4: "B",  "4#": "C",
  "5b": "C",  5: "Db", "5#": "D",
  "6b": "D",  6: "Eb", "6#": "E",
  "7b": "E",  7: "F",  "7#": "Gb",
};
// prettier-ignore
const aFlat: Scale = {
  "1b": "G",  1: "Ab", "1#": "A",
  "2b": "A",  2: "Bb", "2#": "B",
  "3b": "B",  3: "C",  "3#": "Db",
  "4b": "C",  4: "Db", "4#": "D",
  "5b": "D",  5: "Eb", "5#": "E",
  "6b": "E",  6: "F",  "6#": "Gb",
  "7b": "Gb", 7: "G",  "7#": "Ab",
};
// prettier-ignore
const bFlat: Scale = {
  "1b": "A",  1: "Bb", "1#": "B",
  "2b": "B",  2: "C",  "2#": "C#",
  "3b": "Db", 3: "D",  "3#": "Eb",
  "4b": "D",  4: "Eb", "4#": "E",
  "5b": "E",  5: "F",  "5#": "F#",
  "6b": "Gb", 6: "G",  "6#": "G#",
  "7b": "Ab", 7: "A",  "7#": "Bb",
};

/**
 * All diatonic mappings from nashville to alphabetical note.
 */
// prettier-ignore
export const NOTES_BY_KEY: Record<Note, Scale> = {
  C: {
    "1b": "B",  1: "C",  "1#": "C#",
    "2b": "Db", 2: "D",  "2#": "D#",
    "3b": "Eb", 3: "E",  "3#": "F",
    "4b": "E",  4: "F",  "4#": "F#",
    "5b": "Gb", 5: "G",  "5#": "G#",
    "6b": "Ab", 6: "A",  "6#": "A#",
    "7b": "Bb", 7: "B",  "7#": "C",
  },

  "C#": {
    "1b": "C",  1: "C#", "1#": "D",
    "2b": "D",  2: "D#", "2#": "E",
    "3b": "E",  3: "F",  "3#": "F#",
    "4b": "F",  4: "F#", "4#": "G",
    "5b": "G",  5: "G#", "5#": "A",
    "6b": "A",  6: "A#", "6#": "B",
    "7b": "B",  7: "C",  "7#": "C#",
  },

  Db: {
    "1b": "C",  1: "Db", "1#": "D",
    "2b": "D",  2: "Eb", "2#": "E",
    "3b": "E",  3: "F",  "3#": "Gb",
    "4b": "F",  4: "Gb", "4#": "G",
    "5b": "G",  5: "Ab", "5#": "A",
    "6b": "A",  6: "Bb", "6#": "B",
    "7b": "B",  7: "C",  "7#": "Db",
  },

  D: {
    "1b": "C#", 1: "D",  "1#": "D#",
    "2b": "Eb", 2: "E",  "2#": "F",
    "3b": "F",  3: "F#", "3#": "G",
    "4b": "F#", 4: "G",  "4#": "G#",
    "5b": "Ab", 5: "A",  "5#": "A#",
    "6b": "Bb", 6: "B",  "6#": "C",
    "7b": "C",  7: "C#", "7#": "D",
  },

  'D#': eFlat,
  Eb: eFlat,

  E: {
    "1b": "D#", 1: "E",  "1#": "F",
    "2b": "F",  2: "F#", "2#": "G",
    "3b": "G",  3: "G#", "3#": "A",
    "4b": "G#", 4: "A",  "4#": "A#",
    "5b": "A#", 5: "B",  "5#": "C",
    "6b": "C",  6: "C#", "6#": "D",
    "7b": "D",  7: "D#", "7#": "E",
  },

  F: {
    "1b": "E",  1: "F",  "1#": "F#",
    "2b": "Gb", 2: "G",  "2#": "G#",
    "3b": "Ab", 3: "A",  "3#": "A#",
    "4b": "A",  4: "A#", "4#": "B",
    "5b": "B",  5: "C",  "5#": "C#",
    "6b": "Db", 6: "D",  "6#": "D#",
    "7b": "Eb", 7: "E",  "7#": "F",
  },

  'F#': gFlat,
  Gb: gFlat,

  G: {
    "1b": "F#", 1: "G",  "1#": "G#",
    "2b": "Ab", 2: "A",  "2#": "A#",
    "3b": "Bb", 3: "B",  "3#": "C",
    "4b": "B",  4: "C",  "4#": "C#",
    "5b": "Db", 5: "D",  "5#": "D#",
    "6b": "Eb", 6: "E",  "6#": "F",
    "7b": "F",  7: "F#", "7#": "G",
  },

  'G#': aFlat,
  Ab: aFlat,

  A: {
    "1b": "G#", 1: "A",  "1#": "A#",
    "2b": "Bb", 2: "B",  "2#": "C",
    "3b": "C",  3: "C#", "3#": "D",
    "4b": "C#", 4: "D",  "4#": "D#",
    "5b": "Eb", 5: "E",  "5#": "F",
    "6b": "F",  6: "F#", "6#": "G",
    "7b": "G",  7: "G#", "7#": "A",
  },

  'A#': bFlat,
  Bb: bFlat,

  B: {
    "1b": "A#", 1: "B",  "1#": "C",
    "2b": "C",  2: "C#", "2#": "D",
    "3b": "D",  3: "D#", "3#": "E",
    "4b": "D#", 4: "E",  "4#": "F",
    "5b": "F",  5: "F#", "5#": "G",
    "6b": "G",  6: "G#", "6#": "A",
    "7b": "A",  7: "A#", "7#": "B",
  },
}
