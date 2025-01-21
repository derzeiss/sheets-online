import type { Note } from './types/Note';

export const META_DIRECTIVES = [
  'title',
  'artist',
  'key',
  'time',
  'ccli_license',
  'ccli',
  'copyright',
  'footer',
  'tempo',
];
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
export const NOTES_FLAT: Note[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

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
