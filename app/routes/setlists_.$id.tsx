import { data } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { SongListItem } from '~/components/SongListItem';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/setlists_.$id';

export async function loader({ params }: Route.LoaderArgs) {
  const setlist = await prisma.setlist.findFirst({
    where: { id: params.id },
    include: { songs: { include: { song: true } } },
  });
  if (!setlist) throw data(`Setlist "${params.id}" not found.`, { status: 404 });

  return { setlist };
}

export default function SetlistRoute({ loaderData }: Route.ComponentProps) {
  const { setlist } = loaderData;
  return (
    <main className="container my-10 max-w-3xl">
      <div className="mb-4 flex gap-2">
        <ButtonLink to="/setlists">← Back</ButtonLink>
        <ButtonLink to="edit">Edit Setlist</ButtonLink>
      </div>

      <h1 className="text-4xl">{setlist.name}</h1>
      <div className="text-neutral-600">{setlist.songAmount} Songs</div>

      <ul className="mt-4">
        {setlist.songs.map((songOn) => (
          <SongListItem key={songOn.id} song={{ ...songOn.song, key: songOn.key }} />
        ))}
      </ul>
    </main>
  );
}
