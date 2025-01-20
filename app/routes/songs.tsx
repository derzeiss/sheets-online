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
      <h1 className="text-5xl">Songs</h1>

      <a
        href="/songs/add"
        className="clickable mt-4 inline-block rounded border border-neutral-200 px-4 py-2"
      >
        + Add song
      </a>

      <ul className="mt-4">
        {songs.map((song) => (
          <SongListItem key={song.id} song={song} />
        ))}
      </ul>
    </main>
  );
}
