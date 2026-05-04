import { ArrowLeftIcon, PencilIcon } from '@proicons/react';
import { useState } from 'react';
import { data, href } from 'react-router';
import { ButtonLink } from '~/components/button/ButtonLink';
import { KeySelectButton } from '~/components/KeySelectButton';
import { SongRenderer } from '~/components/SongRenderer';
import type { Note } from '~/domain/chordpro-parser/types/Note';
import { prisma } from '~/domain/prisma';
import type { Route } from './+types/$id';

export async function loader({ params }: Route.LoaderArgs) {
  const song = await prisma.song.findFirst({ where: { id: params.id } });
  if (!song) throw data(`Song "${params.id}" not found.`, { status: 404 });
  return { song };
}

export default function SongRoute({ loaderData }: Route.ComponentProps) {
  const { song } = loaderData;
  const [targetKey, setTargetKey] = useState<Note>((song.key as Note) || 'C');

  return (
    <main className="content my-10">
      <div className="mb-8 flex gap-2">
        <ButtonLink to={href('/songs')} size="sm">
          <ArrowLeftIcon size={20} /> Back
        </ButtonLink>
        <ButtonLink to={href('/songs/:id/edit', { id: song.id })} size="sm">
          <PencilIcon size={20} />
          Edit song
        </ButtonLink>
      </div>
      <KeySelectButton
        selectedKey={targetKey}
        onKeySelect={setTargetKey}
        className="mb-2"
      />
      <SongRenderer targetKey={targetKey} prosong={song.prosong} />
    </main>
  );
}
