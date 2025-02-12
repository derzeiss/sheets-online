import type { Setlist, Song, SongsOnSetlist } from '@prisma/client';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { data } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { KeyKeyboard } from '~/components/KeyKeyboard';
import { ScrollIndicator } from '~/components/ScrollIndicator';
import { SongListItem } from '~/components/SongListItem';
import { SongRenderer } from '~/components/SongRenderer';
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
    if (isNote(songOn.song.key)) key = songOn.song.key;
    songKeys[songOn.id] = key;
    return songKeys;
  }, {});
};

export default function SongRoute({ loaderData }: Route.ComponentProps) {
  const { setlist } = loaderData;
  const [songKeys, setSongKeys] = useState<Record<string, Note>>(getSetlistSongKeys(setlist));
  const [keyListOpen, setKeyListOpen] = useState(false);
  const [songListOpen, setSongListOpen] = useState(false);

  const anyListOpen = keyListOpen || songListOpen;

  const toggleList = (state: boolean, setter?: Dispatch<SetStateAction<boolean>>) => {
    setKeyListOpen(false);
    setSongListOpen(false);

    setter && setter(state);
  };

  return (
    <main className="content my-10">
      <ScrollIndicator targetSel="#song-container" />

      <div
        className={cx('fixed inset-0', {
          hidden: !anyListOpen,
          visible: anyListOpen,
        })}
        onClick={() => toggleList(false)}
      ></div>

      <div id="song-container" className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {setlist.songs.map((songOn) => (
          <div
            id={songOn.id}
            key={songOn.id}
            className="min-w-full snap-start snap-always overflow-hidden"
          >
            {/* key list */}
            <div className="relative mb-2 w-fit">
              <KeyKeyboard
                selectedKey={songKeys[songOn.id]}
                onKeySelect={(n) => setSongKeys({ ...songKeys, [songOn.id]: n })}
                className={cx(
                  'absolute left-0 top-[calc(100%+0.5rem)] rounded border bg-white p-2 shadow-lg transition-all',
                  {
                    'invisible -translate-y-2 opacity-0': !keyListOpen,
                    'visible translate-y-0 opacity-100': keyListOpen,
                  },
                )}
              />

              <Button onClick={() => toggleList(!keyListOpen, setKeyListOpen)}>♫ Key</Button>
            </div>

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
        <Button onClick={() => toggleList(!songListOpen, setSongListOpen)}>= Songs</Button>
      </div>
    </main>
  );
}
