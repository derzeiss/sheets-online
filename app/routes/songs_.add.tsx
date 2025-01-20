import { useState, type FormEvent } from 'react';
import { Form, redirect, useSubmit } from 'react-router';
import { SongRenderer } from '~/components/SongRenderer';
import { parseSong } from '~/modules/chordpro-parser/parser';
import type { Route } from './+types/songs_.add';
import { prisma } from '~/modules/prisma';
import type { Song } from '@prisma/client';

const songBlueprint = `{title: }
{artist: }
{key: }
{time: 4/4}
{tempo: }
{ccli: }

{comment: Verse 1}

{comment: Chorus}

{comment: Bridge}`;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  await prisma.song.create({ data: values as Song });
  return redirect('/songs');
}

export default function SongsAddRoute() {
  const submit = useSubmit();
  const [prosong, setProsong] = useState(songBlueprint);

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
    <main className="container my-10">
      <h1 className="text-5xl">Add Song</h1>
      <div className="mt-8 grid grid-cols-2 gap-12">
        <Form onSubmit={handleSubmit} method="post">
          <div>
            <textarea
              name="prosong"
              className="h-[calc(100vh-14rem)] w-full rounded-lg border border-neutral-300 p-4"
              value={prosong}
              onChange={(ev) => setProsong(ev.target.value)}
            ></textarea>
            <button className="clickable inline-block rounded bg-neutral-100 px-4 py-2">
              Save
            </button>
          </div>
        </Form>
        <SongRenderer prosong={prosong} />
      </div>
    </main>
  );
}
