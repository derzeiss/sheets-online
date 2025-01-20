import { Link } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { SongListItem } from '~/components/SongListItem';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/songs';

export const loader = async () => {
  const songs = await prisma.song.findMany();
  return songs;
};

export default function SongsRoute({ loaderData: songs }: Route.ComponentProps) {
  return (
    <main className="container my-10">
      <h1 className="mb-4 text-5xl">Songs</h1>

      <ButtonLink to="/songs/new/edit">+ Add Song</ButtonLink>

      <ul className="mt-4 max-w-xl">
        {songs.map((song) => (
          <Link key={song.id} to={`/songs/${song.id}`} className="clickable block">
            <SongListItem song={song} />
          </Link>
        ))}
      </ul>
    </main>
  );
}
