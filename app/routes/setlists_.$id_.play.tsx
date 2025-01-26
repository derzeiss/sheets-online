import { useState } from 'react';
import { data } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
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
  const [currIndex, setCurrIndex] = useState(0);

  const handleIndexChange = (delta: number) => {
    setCurrIndex((setlist.songAmount + currIndex + delta) % setlist.songAmount);
  };

  return (
    <main className="content my-10">
      <div
        className="fixed left-0 top-0 h-2 w-full origin-left bg-blue-300 transition-transform"
        style={{ transform: `scaleX(${((currIndex + 1) / setlist.songAmount) * 100}%)` }}
      />
      <div className="overflow-hidden">
        <div
          className="flex transition-transform"
          style={{ transform: `translateX(-${currIndex * 100}%)` }}
        >
          {setlist.songs.map((songOn) => (
            <div key={songOn.id} className="min-w-full">
              <SongRenderer
                showTargetKey
                targetKey={isNote(songOn.key) ? songOn.key : 'Nashville'}
                prosong={songOn.song.prosong}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-16 right-8 flex gap-4">
        <ButtonLink to={`/setlists/${setlist.id}`} className="mr-4">
          X
        </ButtonLink>
        <Button onClick={() => handleIndexChange(-1)}>← Prev</Button>
        <Button onClick={() => handleIndexChange(1)}>Next →</Button>
      </div>
    </main>
  );
}
