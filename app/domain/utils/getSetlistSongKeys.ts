import { isNote } from '~/domain/chordpro-parser/utils/typeguards';
import type { SetlistItemWithSong } from '~/prismaExtensions';
import type { Key } from '../chordpro-parser/types/Key';

// Kinda duplicate in ./getSongKey.ts
export const getSetlistSongKeys = (items: SetlistItemWithSong[]) => {
  return items.reduce<Record<string, Key>>((songKeys, item) => {
    let key: Key = 'Nashville';
    if (isNote(item.key)) key = item.key;
    else if (isNote(item.song.key)) key = item.song.key;
    songKeys[item.id] = key;
    return songKeys;
  }, {});
};
