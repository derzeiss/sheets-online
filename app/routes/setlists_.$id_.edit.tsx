import type { Setlist, Song, SongsOnSetlist } from '@prisma/client';
import { useState, type FormEvent } from 'react';
import { data, Form, redirect, useSubmit } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { ConfirmButton } from '~/components/ConfirmButton';
import { SongListItem } from '~/components/SongListItem';
import { NOTES_SHARP } from '~/modules/chordpro-parser/constants';
import { isNote } from '~/modules/chordpro-parser/typeguards';
import { prisma } from '~/modules/prisma';
import { setlistsSchema } from '~/schemas';
import type { FormValues } from '~/types/FormValues';
import type { Route } from './+types/setlists_.$id_.edit';

const blankSetlist: Setlist = {
  id: 'new',
  name: '',
  songAmount: 0,
};

export async function loader({ params }: Route.LoaderArgs) {
  const songs = await prisma.song.findMany();
  if (!songs) throw data('Error while fetching songs for setlist.', { status: 500 });

  if (params.id === 'new') return { setlist: { ...blankSetlist }, songs };

  const setlist = await prisma.setlist.findFirst({ where: { id: params.id } });
  if (!setlist) throw data(`Setlist "${params.id}" not found.`, { status: 404 });

  return { setlist, songs };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (!values.id || typeof values.id !== 'string') {
    throw data('No setlist id given.', { status: 400 });
  }

  switch (values._action) {
    case 'save':
      return await upsertSetlist(values.id, values);
    case 'delete':
      return await deleteSetlist(values.id);
  }
}

async function upsertSetlist(id: string, values: FormValues) {
  values.songs = JSON.parse(values.songs as string);
  const setlist = setlistsSchema.parse(values);

  if (values.id === 'new') {
    const songsWithoutSetlistId = setlist.songs.map((s) => ({
      order: s.order,
      key: s.key,
      songId: s.songId,
    }));

    const queryData = {
      ...setlist,
      songs: { create: songsWithoutSetlistId },
    };

    console.log('QQ', JSON.stringify(queryData, null, 2));

    await prisma.setlist.create({ data: queryData });
    return redirect('/setlists');
  }
  // else {
  //   await prisma.setlist.update({ where: { id }, data: setlist });
  //   return redirect(`/setlists/${values.id}`);
  // }
}

async function deleteSetlist(id: string) {
  const deleteSongsOn = prisma.songsOnSetlist.deleteMany({ where: { setlistId: id } });
  const deleteSetlist = prisma.setlist.delete({ where: { id } });
  await prisma.$transaction([deleteSongsOn, deleteSetlist]);
  return redirect('/setlists');
}

interface SongsOnSetlistClient extends SongsOnSetlist {
  song: Song;
}

export default function SetlistsEditRoute({ loaderData }: Route.ComponentProps) {
  const { setlist, songs } = loaderData;
  const submit = useSubmit();
  const isCreation = setlist.id === 'new';

  const [songsOn, setSongsOn] = useState<SongsOnSetlistClient[]>([]);
  const [songsOnIds] = useState(new Set<string>());
  const [songAmount, setSongAmount] = useState(setlist.songAmount);

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    let $form = ev.currentTarget;
    let formData = new FormData($form);

    const songsOnServer: SongsOnSetlist[] = songsOn.map((s) => ({
      id: s.id,
      key: s.key,
      order: s.order,
      songId: s.songId,
      setlistId: s.setlistId,
    }));
    formData.set('songs', JSON.stringify(songsOnServer));

    submit(formData, {
      method: 'post',
    });
  };

  const handleSongAdd = (song: Song) => {
    const songOnSetlist: SongsOnSetlistClient = {
      id: crypto.randomUUID(),
      key: song.key,
      order: 0,
      setlistId: setlist.id,
      songId: song.id,
      song,
    };
    setSongsOn([...songsOn, songOnSetlist]);
    setSongAmount(songAmount + 1);
    songsOnIds.add(song.id);
  };

  const handleSongRemove = (index: number) => {
    const songId = songsOn[index].songId;
    setSongsOn(songsOn.filter((_s, i) => i !== index));
    setSongAmount(songAmount - 1);

    if (!songsOn.find((songOn) => songOn.songId === songId)) songsOnIds.delete(songId);
  };

  const handleKeyChange = (songOn: SongsOnSetlistClient, key: string) => {
    if (!isNote(key)) return;

    const newSongOn = { ...songOn, key };
    setSongsOn([...songsOn.map((_songOn) => (_songOn.id === newSongOn.id ? newSongOn : _songOn))]);
  };

  return (
    <main className="container my-10 max-w-3xl">
      <Form onSubmit={handleSubmit} method="post">
        <h1 className="mb-6 text-4xl">{isCreation ? 'Create' : 'Edit'} Setlist</h1>

        <label htmlFor="name" className="mb-1 block text-sm font-semibold">
          Setlist Name
        </label>
        <input
          id="name"
          name="name"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          defaultValue={setlist.name}
          required
        />

        <h2 className="mt-6 text-2xl">Songs</h2>

        <ul className="mt-4">
          {songsOn.map((songOn, i) => (
            <li
              key={songOn.id}
              className="border-t-300 flex w-full justify-between gap-2 border-t px-2 py-1 text-left"
            >
              <div>
                <h2>{songOn.song.title}</h2>
                <div className="text-sm text-neutral-600">{songOn.song.artist}</div>
              </div>
              <select
                className="btn ml-auto w-20"
                value={songOn.key || 'C'}
                onChange={(ev) => handleKeyChange(songOn, ev.target.value)}
              >
                {NOTES_SHARP.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
                <option value="Nashville">Nashville</option>
              </select>
              <button
                key={songOn.id}
                onClick={() => handleSongRemove(i)}
                className="btn bg-red-100"
                type="button"
              >
                X
              </button>
            </li>
          ))}
        </ul>

        <h2 className="mt-6 text-2xl">Add songs</h2>

        <ul className="mt-4">
          {songs.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSongAdd(song)}
              className="block w-full"
              type="button"
            >
              <SongListItem song={song} />
            </button>
          ))}
        </ul>

        <input type="hidden" name="songAmount" value={songAmount} />
        <div className="mt-8 flex gap-2">
          <Button type="submit">Save</Button>
          <ButtonLink to={`/setlists/${isCreation ? '' : setlist.id}`}>Cancel</ButtonLink>
        </div>

        <input type="hidden" name="id" value={setlist.id} />
        <input type="hidden" name="_action" value="save" />
      </Form>

      <Form method="post" className="mt-4">
        <input type="hidden" name="id" value={setlist.id} />
        <input type="hidden" name="_action" value="delete" />
        <ConfirmButton className="bg-red-200" type="submit">
          Delete Setlist
        </ConfirmButton>
      </Form>
    </main>
  );
}
