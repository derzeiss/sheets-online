import { NASHVILLE_ALL, NOTES_ALL } from './constants';
import type { Block } from './types/Block';
import type { Nashville } from './types/Nashville';
import type { Note } from './types/Note';
import type { SongLine } from './types/SongLine';

export const lineIsComment = (val: SongLine): val is SongLine<string> =>
  val.type === 'comment';
export const lineIsWithChords = (val: SongLine): val is SongLine<Block[]> =>
  val.type === 'with-chords' || val.type === 'chords-only';

export const isNote = (val: unknown): val is Note =>
  NOTES_ALL.includes((val + '') as Note);
export const isNashville = (val: unknown): val is Nashville =>
  NASHVILLE_ALL.includes((val + '') as Nashville);
