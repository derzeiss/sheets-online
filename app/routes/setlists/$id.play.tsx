import {
  ArrowLeftIcon,
  BulletListIcon,
  TextCaseTitleIcon,
} from '@proicons/react';
import clsx from 'clsx';
import { useState } from 'react';
import { data, Link } from 'react-router';
import { Button } from '~/components/button/Button';
import { ButtonLink } from '~/components/button/ButtonLink';
import { KeySelectButton } from '~/components/KeySelectButton';
import { SongListItem } from '~/components/list-item/SongListItem';
import { ScrollIndicator } from '~/components/ScrollIndicator';
import { SongRenderer } from '~/components/SongRenderer';
import { TooltipCloseBg } from '~/components/TooltipCloseBg';
import { isNote } from '~/domain/chordpro-parser/typeguards';
import type { Note } from '~/domain/chordpro-parser/types/Note';
import { prisma } from '~/domain/prisma';
import {
  setlistWithItemsWithSongInclude,
  type SetlistWithItemWithSong,
} from '~/prismaExtensions';
import type { Route } from './+types/$id.play';

export async function loader({ params }: Route.LoaderArgs) {
  const setlist = await prisma.setlist.findFirst({
    where: { slug: params.slug },
    include: setlistWithItemsWithSongInclude,
  });
  if (!setlist) {
    throw data(`Setlist "${params.slug}" not found.`, { status: 404 });
  }

  return { setlist };
}

const getSetlistSongKeys = (setlist: SetlistWithItemWithSong) => {
  return setlist.items.reduce<Record<string, Note>>((songKeys, item) => {
    let key: Note = 'Nashville';
    if (isNote(item.key)) key = item.key;
    else if (isNote(item.song.key)) key = item.song.key;
    songKeys[item.id] = key;
    return songKeys;
  }, {});
};

export default function SongRoute({ loaderData }: Route.ComponentProps) {
  const { setlist } = loaderData;
  const [songKeys, setSongKeys] = useState<Record<string, Note>>(() =>
    getSetlistSongKeys(setlist),
  );
  const [songListOpen, setSongListOpen] = useState(false);
  const [showTextOnly, setShowTextOnly] = useState(false);

  return (
    <main className="content my-10">
      <ScrollIndicator targetSel="#song-container" />

      <TooltipCloseBg
        visible={songListOpen}
        onClick={() => setSongListOpen(false)}
      />

      <div
        id="song-container"
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {setlist.items.map((item) => (
          <div
            id={item.id}
            key={item.id}
            className="min-w-full snap-start snap-always overflow-hidden"
          >
            <div className="mb-4 flex gap-2">
              {/* key list */}
              <KeySelectButton
                selectedKey={songKeys[item.id]}
                onKeySelect={(note) =>
                  setSongKeys({ ...songKeys, [item.id]: note })
                }
              />
              <Button
                type="button"
                size="sm"
                onClick={() => setShowTextOnly(!showTextOnly)}
                className={clsx({
                  'bg-yellow-50 inset-ring-yellow-400': showTextOnly,
                })}
              >
                <TextCaseTitleIcon size={20} />
                Lyrics only
              </Button>
            </div>

            <SongRenderer
              targetKey={songKeys[item.id]}
              prosong={item.song.prosong}
              textOnly={showTextOnly}
            />
          </div>
        ))}
      </div>

      <ButtonLink
        size="sm"
        to=".."
        relative="path"
        className="fixed bottom-8 left-8 shadow-lg"
      >
        <ArrowLeftIcon size={20} />
        Back
      </ButtonLink>

      <div className="fixed right-8 bottom-8 flex gap-4 *:shadow-lg">
        {/* song list */}
        <ul
          className={clsx(
            'absolute right-0 bottom-[calc(100%+0.5rem)] max-h-[calc(100vh-6rem)] w-120 max-w-[90vw] overflow-y-scroll rounded-3xl border border-neutral-200 bg-white transition-all',
            {
              'invisible -translate-y-2 opacity-0': !songListOpen,
              'visible translate-y-0 opacity-100': songListOpen,
            },
          )}
        >
          {setlist.items.map((item) => (
            <Link
              key={item.id}
              to={`#${item.id}`}
              className="clickable block first:-mt-px"
            >
              <SongListItem song={{ ...item.song, key: item.key }} />
            </Link>
          ))}
        </ul>
        <Button size="sm" onClick={() => setSongListOpen(!songListOpen)}>
          <BulletListIcon size={20} />
          Songs
        </Button>
      </div>
    </main>
  );
}
