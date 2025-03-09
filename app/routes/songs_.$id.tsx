import { useState } from 'react';
import { data } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { KeySelectButton } from '~/components/KeySelectButton';
import { SongRenderer } from '~/components/SongRenderer';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/songs_.$id';

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
      <div className="mb-4 flex gap-2">
        <ButtonLink to="/songs">← Back</ButtonLink>
        <ButtonLink to="edit">Edit song</ButtonLink>
      </div>
      <KeySelectButton selectedKey={targetKey} onKeySelect={setTargetKey} />
      <SongRenderer targetKey={targetKey} prosong={song.prosong} />
    </main>
  );
}
