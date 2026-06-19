import type { Note } from './Note';

/**
 * Nashville numbers to alphabetical chords. Does include all steps, not only melodic (3#, 4b, ...)
 */
export type Scale = {
  '1b': Note;
  '1': Note;
  '1#': Note;
  '2b': Note;
  '2': Note;
  '2#': Note;
  '3b': Note;
  '3': Note;
  '3#': Note;
  '4b': Note;
  '4': Note;
  '4#': Note;
  '5b': Note;
  '5': Note;
  '5#': Note;
  '6b': Note;
  '6': Note;
  '6#': Note;
  '7b': Note;
  '7': Note;
  '7#': Note;
};
