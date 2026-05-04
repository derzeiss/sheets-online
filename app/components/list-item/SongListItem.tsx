import type { Song } from '@prisma/client';
import type { FC } from 'react';
import { TextMeta } from '../TextMeta';
import { ListItem } from './ListItem';

interface Props {
  song: Song;
}

export const SongListItem: FC<Props> = ({ song }) => (
  <ListItem>
    <div>
      {song.title}
      <TextMeta>{song.artist}</TextMeta>
    </div>
    {song.key}
  </ListItem>
);
