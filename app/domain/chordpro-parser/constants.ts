import type { Nashville } from './types/Nashville';
import type { Note } from './types/Note';

export const FORMAT_DIRECTIVES = ['comment'];
// all directives that may occur multiple times in a file
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
  'Nashville',
];

export const NASHVILLE_ALL: Nashville[] = [
  '1',
  '1#',
  '2b',
  '2',
  '2#',
  '3b',
  '3',
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

export const KEYS_SHARP: Note[] = [
  'C',
  'C#',
  'G',
  'G#',
  'D',
  'D#',
  'A',
  'A#',
  'E',
  'B',
  'F#',
];
export const KEYS_FLAT: Note[] = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
