import { useState, type FormEvent } from 'react';
import { data, Form, redirect, useSubmit } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { ConfirmButton } from '~/components/ConfirmButton';
import { SongControls } from '~/components/SongControls';
import { SongRenderer } from '~/components/SongRenderer';
import { parseSong } from '~/modules/chordpro-parser/parser';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import { prisma } from '~/modules/prisma';
import { songSchema } from '~/schemas';
import type { FormValues } from '~/types/FormValues';
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
  if (params.id === 'new') return { song: { id: 'new', prosong: songBlueprint } };

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

async function upsertSong(id: string, values: FormValues) {
  const song = songSchema.parse(values);

  if (values.id === 'new') {
    await prisma.song.create({ data: song });
    return redirect('/songs');
  } else {
    await prisma.song.update({ where: { id }, data: song });
    return redirect(`/songs/${values.id}`);
  }
}

async function deleteSong(id: string) {
  await prisma.song.delete({ where: { id } });
  return redirect('/songs');
}

export default function SongsEditRoute({ loaderData }: Route.ComponentProps) {
  const { song } = loaderData;
  const submit = useSubmit();
  const [targetKey, setTargetKey] = useState<Note>('C');
  const [prosong, setProsong] = useState(song.prosong);
  const [isAboutToDelete, setIsAboutToDelete] = useState(false);
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
    <main className="container my-10 grid grid-cols-2 gap-12">
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
          <ConfirmButton className="bg-red-200" type="submit">
            Delete song
          </ConfirmButton>
        </Form>
      </div>
      <div>
        <SongControls targetKey={targetKey} onKeyUpdated={setTargetKey} />
        <SongRenderer targetKey={targetKey} prosong={prosong} />
      </div>
    </main>
  );
}
