import { data } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { ScrollIndicator } from '~/components/ScrollIndicator';
import { SongRenderer } from '~/components/SongRenderer';
import { isNote } from '~/modules/chordpro-parser/typeguards';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/setlists_.$id_.play';

export async function loader({ params }: Route.LoaderArgs) {
  const setlist = await prisma.setlist.findFirst({
    where: { id: params.id },
    include: { songs: { include: { song: true } } },
  });
  if (!setlist) throw data(`Setlist "${params.id}" not found.`, { status: 404 });

  return { setlist };
}

export default function SongRoute({ loaderData }: Route.ComponentProps) {
  const { setlist } = loaderData;

  return (
    <main className="content my-10">
      <ScrollIndicator targetSel="#song-container" />
      <div id="song-container" className="flex snap-x snap-mandatory overflow-x-auto">
        {setlist.songs.map((songOn) => (
          <div key={songOn.id} className="min-w-full snap-start snap-always overflow-hidden">
            <SongRenderer
              showTargetKey
              targetKey={isNote(songOn.key) ? songOn.key : 'Nashville'}
              prosong={songOn.song.prosong}
            />
          </div>
        ))}
      </div>
      <div className="fixed bottom-12 right-8 flex gap-4">
        <ButtonLink to={`/setlists/${setlist.id}`} className="mr-4">
          X
        </ButtonLink>
      </div>
    </main>
  );
}
