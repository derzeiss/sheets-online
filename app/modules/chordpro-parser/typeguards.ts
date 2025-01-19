import type { Block } from './types/Block';
import type { SongLine } from './types/SongLine';

export const lineIsComment = (val: SongLine): val is SongLine<string> => val.type === 'comment';
export const lineIsWithChords = (val: SongLine): val is SongLine<Block[]> =>
  val.type === 'with-chords';
