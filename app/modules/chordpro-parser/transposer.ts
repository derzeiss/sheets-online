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
        const transposedChord = transposeChord(chord, delta);
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

const transposeChord = (chord: string, delta: number) => {
  const parts = extractNotesFromChord(chord);
  const partsTransposed = parts.map(([note, appendix]) => {
    const transposedNote = transposeNote(note, delta);
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
  const iNew = (notes.length + i + delta) % notes.length;
  return notes[iNew];
};

const getKeyDelta = (originalKey: Note, targetKey: Note) => {
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
