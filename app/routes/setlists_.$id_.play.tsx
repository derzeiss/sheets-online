import { data } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { ScrollIndicator } from '~/components/ScrollIndicator';
import { SongRenderer } from '~/components/SongRenderer';
import { isNote } from '~/modules/chordpro-parser/typeguards';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/setlists_.$id_.play';
import { SongListItem } from '~/components/SongListItem';
import { Button } from '~/components/Button';
import { useState } from 'react';
import { cx } from '~/utils/cx';

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
  const [songListOpen, setSongListOpen] = useState(false);

  return (
    <main className="content my-10">
      <ScrollIndicator targetSel="#song-container" />
      <div id="song-container" className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {setlist.songs.map((songOn) => (
          <div
            id={songOn.id}
            key={songOn.id}
            className="min-w-full snap-start snap-always overflow-hidden"
          >
            <SongRenderer
              showTargetKey
              targetKey={isNote(songOn.key) ? songOn.key : 'Nashville'}
              prosong={songOn.song.prosong}
            />
          </div>
        ))}
      </div>
      <div className="fixed bottom-12 right-8 flex gap-4">
        <ButtonLink to={`/setlists/${setlist.id}`}>X</ButtonLink>
        <div
          className={cx('fixed inset-0', { hidden: !songListOpen, visible: songListOpen })}
          onClick={() => setSongListOpen(false)}
        ></div>
        <ul
          className={cx(
            'absolute bottom-[calc(100%+0.5rem)] right-0 w-[30rem] rounded border bg-white shadow-lg transition-all',
            {
              'invisible -translate-y-2 opacity-0': !songListOpen,
              'visible translate-y-0 opacity-100': songListOpen,
            },
          )}
        >
          {setlist.songs.map((songOn) => (
            <a key={songOn.id} href={`#${songOn.id}`} className="clickable block">
              <SongListItem song={{ ...songOn.song, key: songOn.key }} />
            </a>
          ))}
        </ul>
        <Button onClick={() => setSongListOpen(!songListOpen)}>Songs</Button>
      </div>
    </main>
  );
}
