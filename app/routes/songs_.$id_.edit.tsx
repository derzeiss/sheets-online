import { useState, type FormEvent } from 'react';
import { data, Form, useSubmit } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { ConfirmButton } from '~/components/ConfirmButton';
import { KeySelectButton } from '~/components/KeySelectButton';
import { SongRenderer } from '~/components/SongRenderer';
import { deleteSong, upsertSong } from '~/dal/song';
import { parseSong } from '~/modules/chordpro-parser/parser';
import { isNote } from '~/modules/chordpro-parser/typeguards';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/songs_.$id_.edit';

const songBlueprint = `{title: }
{artist: }
{key: }
{time: 4/4}
{tempo: }
{ccli: }

{comment: Verse 1}

{comment: Chorus}

{comment: Bridge}`;

export async function loader({ params }: Route.LoaderArgs) {
  if (params.id === 'new') return { song: { id: 'new', key: 'C', prosong: songBlueprint } };

  const song = await prisma.song.findFirst({ where: { id: params.id } });
  if (!song) throw data(`Song "${params.id}" not found.`, { status: 404 });

  return { song };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (!values.id || typeof values.id !== 'string') throw data('No song id given.', { status: 400 });

  switch (values._action) {
    case 'save':
      return await upsertSong(values.id, values);
    case 'delete':
      return await deleteSong(values.id);
  }
}

export default function SongsEditRoute({ loaderData }: Route.ComponentProps) {
  const { song } = loaderData;
  const submit = useSubmit();
  const [targetKey, setTargetKey] = useState<Note>(isNote(song.key) ? song.key : 'C');
  const [prosong, setProsong] = useState(song.prosong);
  const isCreation = song.id === 'new';

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    let $form = ev.currentTarget;
    let formData = new FormData($form);

    // add meta info
    const song = parseSong(prosong);
    Object.entries(song.meta).forEach(([key, val]) => {
      formData.set(key, val);
    });

    submit(formData, {
      method: 'post',
    });
  };

  return (
    <main className="content my-10 grid h-[calc(100vh-7.75rem)] gap-12 overflow-hidden lg:grid-cols-2">
      <div>
        <Form onSubmit={handleSubmit} method="post">
          <input type="hidden" name="id" value={song.id} />
          <input type="hidden" name="_action" value="save" />
          <div>
            <textarea
              name="prosong"
              className="h-[calc(100vh-14rem)] w-full rounded-lg border border-neutral-300 p-4"
              value={prosong}
              onChange={(ev) => setProsong(ev.target.value)}
            ></textarea>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <ButtonLink to={`/songs/${isCreation ? '' : song.id}`}>Cancel</ButtonLink>
            </div>
          </div>
        </Form>

        <Form method="post" className="mt-4">
          <input type="hidden" name="id" value={song.id} />
          <input type="hidden" name="_action" value="delete" />
          <ConfirmButton className="bg-red-200" type="submit" childrenConfirm="You sure?">
            Delete song
          </ConfirmButton>
        </Form>
      </div>
      <div className="overflow-auto">
        <KeySelectButton selectedKey={targetKey} onKeySelect={setTargetKey} />
        <SongRenderer targetKey={targetKey} prosong={prosong} />
      </div>
    </main>
  );
}
