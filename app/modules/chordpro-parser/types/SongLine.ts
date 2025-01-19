import type { Block } from './Block';

export interface SongLine<T = string | Block[]> {
  id: number;
  type: 'lyrics-only' | 'with-chords' | 'comment' | 'whitespace';
  content: T;
}
