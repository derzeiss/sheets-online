import { arrIndexContain } from '~/utils/arrIndexContain';
import { NOTES_FLAT, NOTES_SHARP } from './constants';
import type { Note } from './types/Note';

/**
 * consists of the chord note + appendix.
 * @example A#maj7 -> [A#, maj7]
 *
 * Chords with bass notes are split into two ChordParts.
 * @example A#maj7/F# -> [[A#, maj7], [F#]]
 */
type ChordPart = [Note, string];

export const transposeSong = (song: string, originalKey: Note, targetKey: Note) => {
  const delta = getKeyDelta(originalKey, targetKey);
  let transposedSong = '';

  let i = 0;
  while (i !== -1) {
    const iChordStart = song.indexOf('[', i);
    if (iChordStart === -1) break;
    const iChordEnd = song.indexOf(']', iChordStart);
    if (iChordEnd === -1) break;

    const chord = song.substring(iChordStart + 1, iChordEnd);
    transposedSong += song.substring(i, iChordStart);
    if (chord) {
      try {
        const transposedChord = transposeChord(chord, originalKey, targetKey, delta);
        transposedSong += `[${transposedChord}]`;
      } catch (err) {
        if ((err as Error).message !== 'Invalid note given.') throw err; // TODO
      }
    }
    i = iChordEnd + 1;
  }
  transposedSong += song.substring(i);

  return transposedSong;
};

const transposeChord = (chord: string, originalKey: Note, targetKey: Note, delta: number) => {
  const parts = extractNotesFromChord(chord);
  const partsTransposed = parts.map(([note, appendix]) => {
    let transposedNote;

    const nashvilleStep = parseInt(chord);
    if (!isNaN(nashvilleStep) && nashvilleStep >= 1 && nashvilleStep <= 7) {
      transposedNote = transposeFromNashville(nashvilleStep, targetKey);
    } else if (targetKey === 'Nashville') {
      transposedNote = transposeToNashville(note, originalKey);
    } else transposedNote = transposeNote(note, delta);

    return transposedNote + appendix;
  });
  return partsTransposed.join('/');
};

const extractNotesFromChord = (chord: string): ChordPart[] =>
  chord.split('/').map(extractNoteFromChord);

const extractNoteFromChord = (chord: string): ChordPart => {
  if (chord[1] === '#' || chord[1] === 'b') {
    return [chord.substring(0, 2) as Note, chord.substring(2)];
  }
  return [chord[0] as Note, chord.substring(1)];
  // TODO check if extracted string really is a note?
};

const transposeNote = (note: Note, delta: number) => {
  const notes = isFlatNote(note) ? NOTES_FLAT : NOTES_SHARP;
  const i = getNoteIndex(note);
  const iNew = arrIndexContain(notes, i + delta);
  return notes[iNew];
};

const transposeToNashville = (note: Note, originalKey: Note) => {
  const notes = isFlatNote(note) ? NOTES_FLAT : NOTES_SHARP;
  const iNote = getNoteIndex(note);
  const iKey = getNoteIndex(originalKey);
  const iDelta = arrIndexContain(notes, iNote - iKey);

  if (iDelta === 0) return '1';
  if (iDelta === 1) return '1#';
  if (iDelta === 2) return '2';
  if (iDelta === 3) return '2#';
  if (iDelta === 4) return '3';
  if (iDelta === 5) return '4';
  if (iDelta === 6) return '4#';
  if (iDelta === 7) return '5';
  if (iDelta === 8) return '5#';
  if (iDelta === 9) return '6';
  if (iDelta === 10) return '6#';
  if (iDelta === 11) return '7';
  if (iDelta === 12) return '7#';
};

const transposeFromNashville = (step: number, targetKey: Note) => {
  if (targetKey === 'Nashville') return step;
  if (step === 1) return targetKey;

  const notes = isFlatNote(targetKey) ? NOTES_FLAT : NOTES_SHARP;
  const iKey = getNoteIndex(targetKey);

  let halfNotesUpFromKey = 0;
  if (step === 2) halfNotesUpFromKey = 2;
  else if (step === 3) halfNotesUpFromKey = 4;
  else if (step === 4) halfNotesUpFromKey = 5;
  else if (step === 5) halfNotesUpFromKey = 7;
  else if (step === 6) halfNotesUpFromKey = 9;
  else if (step === 7) halfNotesUpFromKey = 11;

  return notes[arrIndexContain(notes, iKey + halfNotesUpFromKey)];
};

const getKeyDelta = (originalKey: Note, targetKey: Note) => {
  if (originalKey === 'Nashville' || targetKey === 'Nashville') return 0;
  const iOriginalKey = getNoteIndex(originalKey);
  const iTargetKey = getNoteIndex(targetKey);
  return iTargetKey - iOriginalKey;
};

const getNoteIndex = (note: Note) => {
  let i = NOTES_SHARP.indexOf(note);
  if (i === -1) i = NOTES_FLAT.indexOf(note);
  if (i === -1) throw new Error('Invalid note given.'); // TODO Error handling here or 1 lvl higher?
  return i;
};

// const isSharpNote = (note: Note) => note.indexOf('#') !== -1;
const isFlatNote = (note: Note) => note.indexOf('b') !== -1;
