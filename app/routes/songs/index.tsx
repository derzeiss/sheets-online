import { AddIcon } from '@proicons/react';
import { useMemo, useState } from 'react';
import { href, Link } from 'react-router';
import { ButtonLink } from '~/components/button/ButtonLink';
import { FabContainer } from '~/components/button/FabContainer';
import { Textbox } from '~/components/form/Textbox';
import { SongListItem } from '~/components/list-item/SongListItem';
import { prisma } from '~/domain/prisma';
import type { Route } from './+types';

export const loader = async () => {
  const songs = await prisma.song.findMany({ orderBy: { title: 'asc' } });
  return { songs };
};

export default function SongsRoute({ loaderData }: Route.ComponentProps) {
  const { songs } = loaderData;

  // add songs query
  const [songQuery, setSongQuery] = useState('');
  const songsFiltered = useMemo(() => {
    if (songQuery.length < 2) return songs;
    const queryLower = songQuery.toLowerCase();
    return songs.filter(
      (song) => song.title.toLowerCase().indexOf(queryLower) > -1,
    );
  }, [songQuery]);

  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="h1">Songs</h1>

      <Textbox
        className="mt-3"
        value={songQuery}
        onChange={(ev) => setSongQuery(ev.target.value)}
        placeholder="Search songs..."
      />
      <ul className="mt-4">
        {songsFiltered.map((song) => (
          <Link
            key={song.id}
            to={href('/songs/:id', { id: song.id })}
            className="clickable block"
          >
            <SongListItem song={song} />
          </Link>
        ))}
      </ul>

      <FabContainer>
        <ButtonLink
          to={href('/songs/:id/edit', { id: 'new' })}
          variant="primary"
        >
          <AddIcon size={20} />
          Add Song
        </ButtonLink>
      </FabContainer>
    </main>
  );
}
