import type { Setlist, Song, SongsOnSetlist } from '@prisma/client';
import { useState } from 'react';
import { data } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { KeySelectButton } from '~/components/KeySelectButton';
import { ScrollIndicator } from '~/components/ScrollIndicator';
import { SongListItem } from '~/components/SongListItem';
import { SongRenderer } from '~/components/SongRenderer';
import { TooltipCloseBg } from '~/components/TooltipCloseBg';
import { isNote } from '~/modules/chordpro-parser/typeguards';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import { prisma } from '~/modules/prisma';
import { cx } from '~/utils/cx';
import type { Route } from './+types/setlists_.$id_.play';

type PopulatedSetlist = Setlist & { songs: (SongsOnSetlist & { song: Song })[] };

export async function loader({ params }: Route.LoaderArgs) {
  const setlist = await prisma.setlist.findFirst({
    where: { id: params.id },
    include: { songs: { include: { song: true } } },
  });
  if (!setlist) throw data(`Setlist "${params.id}" not found.`, { status: 404 });

  return { setlist };
}

const getSetlistSongKeys = (setlist: PopulatedSetlist) => {
  return setlist.songs.reduce<Record<string, Note>>((songKeys, songOn) => {
    let key: Note = 'Nashville';
    if (isNote(songOn.key)) key = songOn.key;
    else if (isNote(songOn.song.key)) key = songOn.song.key;
    songKeys[songOn.id] = key;
    return songKeys;
  }, {});
};

export default function SongRoute({ loaderData }: Route.ComponentProps) {
  const { setlist } = loaderData;
  const [songKeys, setSongKeys] = useState<Record<string, Note>>(() => getSetlistSongKeys(setlist));
  const [songListOpen, setSongListOpen] = useState(false);

  return (
    <main className="content my-10">
      <ScrollIndicator targetSel="#song-container" />

      <TooltipCloseBg visible={songListOpen} onClick={() => setSongListOpen(false)} />

      <div id="song-container" className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {setlist.songs.map((songOn) => (
          <div
            id={songOn.id}
            key={songOn.id}
            className="min-w-full snap-start snap-always overflow-hidden"
          >
            {/* key list */}
            <KeySelectButton
              selectedKey={songKeys[songOn.id]}
              onKeySelect={(note) => setSongKeys({ ...songKeys, [songOn.id]: note })}
            />

            <SongRenderer targetKey={songKeys[songOn.id]} prosong={songOn.song.prosong} />
          </div>
        ))}
      </div>

      <ButtonLink to={`/setlists/${setlist.id}`} className="fixed bottom-8 left-8">
        ← Back
      </ButtonLink>

      <div className="fixed bottom-8 right-8 flex gap-4">
        {/* song list */}
        <ul
          className={cx(
            'absolute bottom-[calc(100%+0.5rem)] right-0 max-h-[calc(100vh-6rem)] w-[30rem] overflow-y-scroll rounded border bg-white shadow-lg transition-all',
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
        <Button onClick={() => setSongListOpen(!songListOpen)}>= Songs</Button>
      </div>
    </main>
  );
}
