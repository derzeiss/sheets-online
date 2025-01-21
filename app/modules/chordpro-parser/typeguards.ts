import { NOTES_ALL } from './constants';
import type { Block } from './types/Block';
import type { Note } from './types/Note';
import type { SongLine } from './types/SongLine';

export const lineIsComment = (val: SongLine): val is SongLine<string> => val.type === 'comment';
export const lineIsWithChords = (val: SongLine): val is SongLine<Block[]> =>
  val.type === 'with-chords';

export const isNote = (val: unknown): val is Note => NOTES_ALL.includes((val + '') as Note);
