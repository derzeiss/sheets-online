import { Link } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { SongListItem } from '~/components/SongListItem';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/songs';
import { useState, useRef, useMemo } from 'react';

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
    return songs.filter((song) => song.title.toLowerCase().indexOf(queryLower) > -1);
  }, [songQuery]);

  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">Songs</h1>

      <ButtonLink to="/songs/new/edit">+ Add Song</ButtonLink>

      <input
        className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2"
        value={songQuery}
        onChange={(ev) => setSongQuery(ev.target.value)}
        placeholder="Search songs..."
      />
      <ul className="mt-4">
        {songsFiltered.map((song) => (
          <Link key={song.id} to={`/songs/${song.id}`} className="clickable block">
            <SongListItem song={song} />
          </Link>
        ))}
      </ul>
    </main>
  );
}
