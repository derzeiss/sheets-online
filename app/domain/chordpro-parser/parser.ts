import {
  ADDITIVE_DIRECTIVES,
  FORMAT_DIRECTIVES,
  NASHVILLE_FLAT,
  NASHVILLE_SHARP,
  NOTES_FLAT,
  NOTES_SHARP,
} from './constants';
import type { Block } from './types/Block';
import type { Chord } from './types/Chord';
import type { Jsong } from './types/Jsong';
import type { Key } from './types/Key';
import type { MajorKey } from './types/MajorKey';
import type { Nashville } from './types/Nashville';
import type { NashvilleChord } from './types/NashvilleChord';
import type { Note } from './types/Note';
import type { SongLine } from './types/SongLine';
import { arrIncludes } from './utils/arrIncludes';
import { clampToArrLength } from './utils/clampToArrLength';
import { isFlatNote } from './utils/isFlatNote';
import { toRelativeMajor } from './utils/toRelativeMajor';
import { isNashville, isNote } from './utils/typeguards';
import { updateChordName } from './utils/updateChordName';

let __nextId = 1;
const getNextId = () => __nextId++;

/** Storage object for compressing keys */
type ChordsUsed = {
  asArr: Jsong['chords'];
  asSet: Set<string>;
  indexByChord: Record<string, number>;
};

export const parseSong = (prosong: string): Jsong => {
  const meta: Jsong['meta'] = { key: 'C' };
  const chords: ChordsUsed = {
    asArr: [],
    asSet: new Set(),
    indexByChord: {},
  };
  const lines: Jsong['lines'] = [];

  prosong.split('\n').map((line) => {
    const lineTrimmed = line.trim();

    // is directive
    if (lineTrimmed[0] === '{' && lineTrimmed[lineTrimmed.length - 1] === '}') {
      const directive = _parseDirective(lineTrimmed);
      if (directive) {
        const [name, val] = directive;

        if (arrIncludes(FORMAT_DIRECTIVES, name)) {
          lines.push({ id: getNextId(), type: 'comment', content: val });
        } else {
          _setMetaField(meta, name, val);
        }
      }
    } else {
      // whitespace
      if (!lineTrimmed) {
        // don't push whitespace as first line
        if (lines.length) {
          lines.push({ id: getNextId(), type: 'whitespace', content: '' });
        }
      } else {
        lines.push(parseLine(line, chords, meta.key));
      }
    }
  });

  return {
    meta,
    chords: chords.asArr,
    lines,
  };
};

const parseLine = (line: string, chords: ChordsUsed, key: Key): SongLine => {
  let lineHasText = false;
  const blocks = line.split('[').reduce<Block[]>((blocks, block) => {
    if (!block) return blocks;
    let [chord, text] = block.split(']');
    if (!text) {
      if (block.indexOf(']') === -1) {
        text = chord;
        chord = '';
      }
    }
    if (!lineHasText && text.trim().length > 0) lineHasText = true;

    const chordIndex = compressChord(chord, chords, key);
    blocks.push({ id: getNextId(), chord: chordIndex, text });
    return blocks;
  }, []);

  // with-chords / chords-only
  if (blocks.length > 1 || blocks[0]?.chord) {
    const type = lineHasText ? 'with-chords' : 'chords-only';
    return { id: getNextId(), type, content: blocks };
  }
  // lyrics-only
  else {
    return { id: getNextId(), type: 'lyrics-only', content: line };
  }
};

/**
 * Compresses {@link chord} as array index of {@link chords}. Alters {@link chords}.
 * @param chord chord to compress
 * @param chords object of chords used
 * @param key song key
 * @example compressChord('C/E', {asSet: {}, asArr: []}, 'G') -> 0
 * (chords altered to: {
 *   asArr: [
 *     {
 *       name: '4/6',
 *       root: '4',
 *       bass: '6',
 *       optional: false
 *     }
 *   ],
 *   asSet: ['C/E'],
 *   indexByChord: {'C/E': 0}
 * })
 * @returns array index
 */
const compressChord = (chord: string, chords: ChordsUsed, key: Key) => {
  if (chords.asSet.has(chord)) {
    return chords.indexByChord[chord];
  }
  const parsedChord = _parseChord(chord);
  if (!parsedChord) return null;
  const nashvilleRoot = noteToNashville(parsedChord.root, key);
  if (!nashvilleRoot) return null;
  const nashvilleChord: NashvilleChord = {
    ...parsedChord,
    root: nashvilleRoot,
    bass: noteToNashville(parsedChord.bass, key) || undefined,
  };

  const index = chords.asArr.length;
  chords.indexByChord[chord] = index;
  chords.asSet.add(chord);
  chords.asArr.push(updateChordName(nashvilleChord));
  return index;
};

/**
 * Parses a string chord (e.g. C#maj7/E) to a {@link Chord} object
 * @param chordStr chord string to parse
 * @example parseChord('C#m7/G#') -> {name: 'C#m7/G#', qual: 'm', ext: '7', bass: 'G#', optional: false}
 * @returns Parsed {@link Chord} object or null
 */
export const _parseChord = (chordStr: string): Chord | null => {
  const chord: Chord = {
    name: chordStr,
    root: '' as Note, // needed as we only look for a root if it's not already set
    optional: false,
  };
  if (chordStr[0] === '(') {
    if (chordStr[chordStr.length - 1] !== ')') return null;
    chord.optional = true;
  }

  const iStart = chord.optional ? 1 : 0;
  const iEnd = chordStr.length - (chord.optional ? 1 : 0);
  for (let i = iStart; i < iEnd; i++) {
    const char = chordStr[i];
    // 1. chord must start with root
    if (!chord.root) {
      if (isNote(char) || isNashville(char)) {
        chord.root = char;
        continue;
      }
      return null;
    }
    // 2. add # or b
    if (char === '#' || char === 'b') {
      chord.root += char;
      continue;
    }
    // 3. add m qual if present
    if (char === 'm') {
      if (!(chordStr[i + 1] === 'a' && chordStr[i + 2] === 'j')) {
        chord.qual = 'm';
        continue;
      }
    }
    // 4. check if bass note starts
    if (char === '/') {
      const note = chordStr.substring(i + 1, iEnd);
      if (isNote(note) || isNashville(note)) chord.bass = note;
      break;
    }
    // 5. else just add ext
    if (chord.ext) {
      chord.ext += char;
    } else {
      chord.ext = char;
    }
  }
  return chord;
};

/**
 * Convert note to nashville number
 * @param note note to transfer
 * @param key key of the note
 * @example noteToNashville('C', 'G') -> '4'
 * @returns parsed nashville number
 */
const noteToNashville = (
  note: Note | Nashville | undefined,
  key: Key | undefined,
) => {
  if (!note || !key || key === 'Nashville') return null;
  if (isNashville(note)) return note;
  const majorKey = toRelativeMajor(key);
  const iNote = getNoteIndex(note);
  const iKey = getNoteIndex(majorKey as MajorKey);
  if (iNote === null || iKey === null) return null;

  const steps = isFlatNote(note) ? NASHVILLE_FLAT : NASHVILLE_SHARP;
  const iDelta = clampToArrLength(iNote - iKey, steps.length);
  return steps[iDelta];
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

/**
 * Parses prosong directive.
 * @param lineTrimmed
 * @example parseDirective('{comment:Chorus}') -> ['comment', 'chorus']
 * @returns [name, value] or null
 */
export const _parseDirective = (
  lineTrimmed: string,
): [name: string, val: string] | null => {
  const iFirstColon = lineTrimmed.indexOf(':');
  if (iFirstColon === -1) return null;
  const name = lineTrimmed.substring(1, iFirstColon);
  const val = lineTrimmed
    .substring(iFirstColon + 1, lineTrimmed.length - 1)
    .trim();
  return [name, val];
};

/**
 * Set meta field in given jsong meta section
 * @param meta object of meta information
 * @param name directive name
 * @param val directive value
 */
export const _setMetaField = (
  meta: Jsong['meta'],
  name: string,
  val: string,
) => {
  if (meta[name] && arrIncludes(ADDITIVE_DIRECTIVES, name)) {
    meta[name] = `${meta[name]}; ${val}`;
  } else {
    meta[name] = val;
  }
};
