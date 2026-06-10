import type { Song } from '@prisma/client';
import type { FC } from 'react';
import type { SearchMatches } from '~/domain/search/wordSearch';
import { TextMeta } from '../TextMeta';
import { ListItem } from './ListItem';

interface Props {
  song: Song & { matches?: SearchMatches };
}

const insertHighlightSpan = (input: string, iStart: number, iEnd: number) =>
  input.substring(0, iStart) +
  '<span class="font-bold bg-primary-100 dark:bg-primary-400/25">' +
  input.substring(iStart, iEnd) +
  '</span>' +
  input.substring(iEnd);

export const SongListItem: FC<Props> = ({ song }) => {
  let title = song.title.replace(/[<>]/g, '');

  if (song.matches) {
    for (let i = song.matches.length - 1; i >= 0; i--) {
      const match = song.matches[i];
      console.log('mm', match);
      if (!match || !Array.isArray(match)) continue;
      let [start, end] = match;

      title = insertHighlightSpan(title, start, end);
    }
  }

  return (
    <ListItem>
      <div>
        <span dangerouslySetInnerHTML={{ __html: title }} />
        <TextMeta>{song.artist}</TextMeta>
      </div>
      {song.key}
    </ListItem>
  );
};
