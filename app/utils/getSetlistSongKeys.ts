import { isNote } from '~/domain/chordpro-parser/typeguards';
import type { Note } from '~/domain/chordpro-parser/types/Note';
import type { SetlistItemWithSong } from '~/prismaExtensions';

// Kinda duplicate in ./getSongKey.ts
export const getSetlistSongKeys = (items: SetlistItemWithSong[]) => {
  return items.reduce<Record<string, Note>>((songKeys, item) => {
    let key: Note = 'Nashville';
    if (isNote(item.key)) key = item.key;
    else if (isNote(item.song.key)) key = item.song.key;
    songKeys[item.id] = key;
    return songKeys;
  }, {});
};
