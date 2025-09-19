import { isNote } from '~/domain/chordpro-parser/typeguards';
import type { SetlistItemWithSong } from '~/prismaExtensions';

// Kinda duplicate in ./getSetlistSongKeys.ts
export const getSongKey = (item: SetlistItemWithSong) => {
  if (isNote(item.key)) return item.key;
  else if (isNote(item.song.key)) return item.song.key;
  return null;
};
