import type { Song } from '@prisma/client';
import type { FC } from 'react';

interface Props {
  song: Song;
}

export const SongListItem: FC<Props> = ({ song }) => {
  return (
    <li className="flex w-full justify-between border-t border-t-neutral-200 px-2 py-1 text-left">
      <div>
        <h2>{song.title}</h2>
        <div className="text-sm text-neutral-600">{song.artist}</div>
      </div>
      <div>{song.key}</div>
    </li>
  );
};
