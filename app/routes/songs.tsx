import { Link } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { SongListItem } from '~/components/SongListItem';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/songs';

export const loader = async () => {
  const songs = await prisma.song.findMany({ orderBy: { title: 'asc' } });
  return { songs };
};

export default function SongsRoute({ loaderData }: Route.ComponentProps) {
  const { songs } = loaderData;

  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">Songs</h1>

      <ButtonLink to="/songs/new/edit">+ Add Song</ButtonLink>

      <ul className="mt-4">
        {songs.map((song) => (
          <Link key={song.id} to={`/songs/${song.id}`} className="clickable block">
            <SongListItem song={song} />
          </Link>
        ))}
      </ul>
    </main>
  );
}
