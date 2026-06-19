import type { Nashville } from './Nashville';
import type { Note } from './Note';

export type Chord = {
  // C#m7/E
  name: string;
  // C#
  root: Note | Nashville;
  // m
  qual?: string;
  // 7
  ext?: string;
  // E
  bass?: Note | Nashville;
  // true if (C#m7/E)
  optional: boolean;
};
