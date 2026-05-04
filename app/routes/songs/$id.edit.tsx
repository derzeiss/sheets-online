import { CancelCircleIcon, DeleteIcon, SaveIcon } from '@proicons/react';
import React, { useState } from 'react';
import { data, Form, href, useSubmit } from 'react-router';
import { Button } from '~/components/button/Button';
import { ButtonLink } from '~/components/button/ButtonLink';
import { DoubleConfirmBtn } from '~/components/button/DoubleConfirmBtn';
import { Textarea } from '~/components/form/Textarea';
import { KeySelectButton } from '~/components/KeySelectButton';
import { SongRenderer } from '~/components/SongRenderer';
import { parseSong } from '~/domain/chordpro-parser/parser';
import { isNote } from '~/domain/chordpro-parser/typeguards';
import type { Note } from '~/domain/chordpro-parser/types/Note';
import { prisma } from '~/domain/prisma';
import { deleteSong, upsertSong } from '~/domain/song/songDal';
import type { Route } from './+types/$id.edit';

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
  if (params.id === 'new') {
    return { song: { id: 'new', key: 'C', prosong: songBlueprint } };
  }

  const song = await prisma.song.findFirst({ where: { id: params.id } });
  if (!song) throw data(`Song "${params.id}" not found.`, { status: 404 });

  return { song };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (!values.id || typeof values.id !== 'string') {
    throw data('No song id given.', { status: 400 });
  }

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
  const [targetKey, setTargetKey] = useState<Note>(
    isNote(song.key) ? song.key : 'C',
  );
  const [prosong, setProsong] = useState(song.prosong);
  const isCreation = song.id === 'new';

  const handleSubmit = (ev: React.SubmitEvent<HTMLFormElement>) => {
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

  const handleDeleteSong = () => {
    submit({ _action: 'delete', id: song.id }, { method: 'post' });
  };

  return (
    <main className="content relative my-10 grid h-[calc(100dvh-7.75rem)] items-stretch gap-12 lg:grid-cols-2">
      <Form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="id" value={song.id} />
        <input type="hidden" name="_action" value="save" />
        <Textarea
          name="prosong"
          className="w-full grow"
          value={prosong}
          onChange={(ev) => setProsong(ev.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="primary">
            <SaveIcon size={20} />
            Save
          </Button>
          <ButtonLink
            to={
              isCreation ? href('/songs') : href('/songs/:id', { id: song.id })
            }
          >
            <CancelCircleIcon size={20} />
            Cancel
          </ButtonLink>
          <DoubleConfirmBtn
            variant="danger"
            size="sm"
            type="button"
            onClick={handleDeleteSong}
            className="ml-auto"
          >
            <DeleteIcon size={20} />
            Delete
          </DoubleConfirmBtn>
        </div>
      </Form>
      <div className="hidden overflow-auto lg:block">
        <KeySelectButton selectedKey={targetKey} onKeySelect={setTargetKey} />
        <SongRenderer targetKey={targetKey} prosong={prosong} />
      </div>
    </main>
  );
}
