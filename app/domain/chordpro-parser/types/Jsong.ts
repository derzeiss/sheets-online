import type { Note } from './Note';
import type { SongLine } from './SongLine';

export interface Jsong {
  meta: {
    key: Note;
    [name: string]: string;
  };
  lines: SongLine[];
}
