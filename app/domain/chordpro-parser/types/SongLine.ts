import type { Block } from './Block';

/**
 * Jsong line containing all strings or blocks for one line.
 */
export interface SongLine<T = string | Block[]> {
  id: number;
  type:
    | 'lyrics-only'
    | 'chords-only'
    | 'with-chords'
    | 'comment'
    | 'whitespace';
  content: T;
}
