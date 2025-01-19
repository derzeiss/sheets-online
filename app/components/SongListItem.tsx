import type { Song } from '@prisma/client';
import type { FC } from 'react';

interface Props {
  song: Song;
}

export const SongListItem: FC<Props> = ({ song }) => {
  return (
    <li className="border-t-300 flex justify-between border-t py-1">
      <div>
        <h2>{song.title}</h2>
        <div className="text-sm text-neutral-600">{song.artist}</div>
      </div>
      <div>{song.key}</div>
    </li>
  );
};
