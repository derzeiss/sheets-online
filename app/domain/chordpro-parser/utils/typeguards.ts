import { KEYS_ALL, NASHVILLE_ALL, NOTES_ALL } from '../constants';
import type { Block } from '../types/Block';
import type { Key } from '../types/Key';
import type { MinorKey } from '../types/MinorKey';
import type { Nashville } from '../types/Nashville';
import type { Note } from '../types/Note';
import type { SongLine } from '../types/SongLine';
import { arrIncludes } from './arrIncludes';

export const lineIsComment = (val: SongLine): val is SongLine<string> =>
  val.type === 'comment';
export const lineIsWithChords = (val: SongLine): val is SongLine<Block[]> =>
  val.type === 'with-chords' || val.type === 'chords-only';

export const isNote = (val: unknown): val is Note =>
  arrIncludes(NOTES_ALL, val);
export const isNashville = (val: unknown): val is Nashville =>
  arrIncludes(NASHVILLE_ALL, val);

export const isKey = (key: unknown): key is Key => arrIncludes(KEYS_ALL, key);
export const isMinorKey = (key: string): key is MinorKey =>
  key[key.length - 1] === 'm';
