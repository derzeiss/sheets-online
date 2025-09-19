import { toArrayIndex } from '~/domain/utils/toArrayIndex';
import { KEYS_FLAT, NASHVILLE_FLAT, NASHVILLE_SHARP, NOTES_FLAT, NOTES_SHARP } from './constants';
import { isNashville, isNote } from './typeguards';
import type { Nashville } from './types/Nashville';
import type { Note } from './types/Note';

/**
 * consists of the chord note + appendix.
 * @example A#maj7 -> [A#, maj7]
 *
 * Chords with bass notes are split into two ChordParts.
 * @example A#maj7/F# -> [[A#, maj7], [F#]]
 */
type ChordPart = [string, string];

export const transposeSong = (prosong: string, keyFrom: Note, keyTo: Note) => {
  const delta = getKeyDelta(keyFrom, keyTo);
  if (delta === null) return prosong; // return original song if invalid original oder target key given
  let transposedSong = '';

  let i = 0;
  while (i !== -1) {
    const iChordStart = prosong.indexOf('[', i);
    if (iChordStart === -1) break;
    const iChordEnd = prosong.indexOf(']', iChordStart);
    if (iChordEnd === -1) break;

    const chord = prosong.substring(iChordStart + 1, iChordEnd);
    transposedSong += prosong.substring(i, iChordStart);
    if (chord) {
      const transposedChord = transposeChord(chord, keyFrom, keyTo, delta);
      transposedSong += `[${transposedChord}]`;
    }
    i = iChordEnd + 1;
  }
  transposedSong += prosong.substring(i);

  return transposedSong;
};

const transposeChord = (chord: string, keyFrom: Note, keyTo: Note, delta: number) => {
  const parts = extractNotesFromChord(chord);
  const partsTransposed = parts.map(([note, appendix]) => {
    let transposedNote;

    if (isNashville(note)) {
      transposedNote = transposeFromNashville(note, keyTo);
    } else if (isNote(note)) {
      if (keyTo === 'Nashville') {
        transposedNote = transposeToNashville(note, keyFrom);
      } else {
        transposedNote = transposeNote(note, keyTo, delta);
      }
    } else {
      // non-note character -> don't transpose
      return note + appendix;
    }

    return transposedNote + appendix;
  });
  return partsTransposed.join('/');
};

const extractNotesFromChord = (chord: string): ChordPart[] =>
  chord.split('/').map(_extractNoteFromChord);

export const _extractNoteFromChord = (chord: string): ChordPart => {
  if (chord[1] === '#' || chord[1] === 'b') {
    return [chord.substring(0, 2) as Note, chord.substring(2)];
  }
  return [chord[0] as Note, chord.substring(1)]; // TODO: check if extracted string really is a note?
};

const transposeNote = (note: Note, keyTo: Note, delta: number) => {
  const notes = isFlatKey(keyTo) ? NOTES_FLAT : NOTES_SHARP;
  const i = getNoteIndex(note);
  if (i === null) return note;
  const iNew = toArrayIndex(notes, i + delta);
  return notes[iNew];
};

const transposeToNashville = (note: Note, keyFrom: Note) => {
  const iNote = getNoteIndex(note);
  const iKey = getNoteIndex(keyFrom);
  if (iNote === null || iKey === null) return note;

  const steps = isFlatNote(note) ? NASHVILLE_FLAT : NASHVILLE_SHARP;
  const iDelta = toArrayIndex(steps, iNote - iKey);
  return steps[iDelta];
};

const transposeFromNashville = (step: Nashville, keyTo: Note) => {
  if (keyTo === 'Nashville') return step;
  if (step === '1') return keyTo;

  const iKey = getNoteIndex(keyTo);
  if (iKey === null) return step;

  const steps = isFlatNote(step) ? NASHVILLE_FLAT : NASHVILLE_SHARP;
  const notes = isFlatKey(keyTo) ? NOTES_FLAT : NOTES_SHARP;
  const halfNotesUpFromKey = steps.indexOf(step);

  return notes[toArrayIndex(notes, iKey + halfNotesUpFromKey)];
};

/**
 * Get key index delta. Returns null if one key is not a valid {@link Note}.
 */
const getKeyDelta = (keyFrom: Note, keyTo: Note) => {
  if (keyFrom === 'Nashville' || keyTo === 'Nashville') return 0;
  const iKeyFrom = getNoteIndex(keyFrom);
  const iKeyTo = getNoteIndex(keyTo);
  if (iKeyFrom === null || iKeyTo === null) return null;
  return iKeyTo - iKeyFrom;
};

/**
 * Get index of note in {@link NOTES_SHARP} or {@link NOTES_FLAT}.
 * Returns null if {@link note} is not a valid {@link Note}.
 */
const getNoteIndex = (note: Note) => {
  let i = NOTES_SHARP.indexOf(note);
  if (i === -1) i = NOTES_FLAT.indexOf(note);
  if (i === -1) return null;
  return i;
};

// const isSharpNote = (note: Note) => note.indexOf('#') !== -1;
const isFlatNote = (note: Note | Nashville) => note.indexOf('b') !== -1;

const isFlatKey = (key: Note) => KEYS_FLAT.indexOf(key) !== -1;
