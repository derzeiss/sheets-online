import type { Prisma, Song } from '@prisma/client';
import { useState, type FormEvent } from 'react';
import { data, Form, useSubmit } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { ConfirmButton } from '~/components/ConfirmButton';
import { SongListItem } from '~/components/SongListItem';
import { deleteSetlist, upsertSetlist } from '~/dal/setlist';
import { NOTES_ALL } from '~/modules/chordpro-parser/constants';
import { isNote } from '~/modules/chordpro-parser/typeguards';
import { prisma } from '~/modules/prisma';
import type { SongsOnSetlistClientDTO } from '~/schemas';
import type { Route } from './+types/setlists_.$id_.edit';

type SongsOnSetlistClient = SongsOnSetlistClientDTO & { song: Song };
type SetlistPopulated = Prisma.SetlistGetPayload<{
  include: { songs: { include: { song: true } } };
}>;

const blankSetlist: SetlistPopulated = {
  id: 'new',
  name: '',
  songAmount: 0,
  songs: [],
};

export async function loader({ params }: Route.LoaderArgs) {
  const songs = await prisma.song.findMany({ orderBy: { title: 'asc' } });
  if (!songs) throw data('Error while fetching songs for setlist.', { status: 500 });

  if (params.id === 'new') return { setlist: { ...blankSetlist }, songs };

  const setlist = await prisma.setlist.findFirst({
    where: { id: params.id },
    include: { songs: { include: { song: true } } },
  });
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
      return await upsertSetlist(values);
    case 'delete':
      return await deleteSetlist(values.id);
  }
}

export default function SetlistsEditRoute({ loaderData }: Route.ComponentProps) {
  const { setlist, songs } = loaderData;
  const submit = useSubmit();
  const isCreation = setlist.id === 'new';

  const [songsOn, setSongsOn] = useState<SongsOnSetlistClient[]>(setlist.songs);

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    let $form = ev.currentTarget;
    let formData = new FormData($form);

    const songsOnDTO: SongsOnSetlistClientDTO[] = songsOn.map((so) => {
      const { song, ...songOn } = so;
      return songOn;
    });

    formData.set('songs', JSON.stringify(songsOnDTO));

    submit(formData, {
      method: 'post',
    });
  };

  const handleSongAdd = (song: Song) => {
    const newSongOnSetlist: SongsOnSetlistClient = {
      id: crypto.randomUUID(),
      key: song.key,
      order: 0,
      setlistId: setlist.id,
      songId: song.id,
      song,
      _added: true,
    };
    setSongsOn([...songsOn, newSongOnSetlist]);
  };

  const handleSongOnRemove = (id: string) => {
    setSongsOn(
      songsOn.reduce<SongsOnSetlistClient[]>((_songsOn, so) => {
        if (so.id !== id) _songsOn.push(so);
        else if (!so._added) {
          let uneditedSongOn: SongsOnSetlistClientDTO | undefined = setlist.songs.find(
            (_so) => _so.id === so.id,
          );
          if (!uneditedSongOn) uneditedSongOn = { ...so, _updated: false };
          _songsOn.push({
            ...uneditedSongOn,
            song: so.song,
            _deleted: true,
            _updated: false,
          });
        }
        return _songsOn;
      }, []),
    );
  };

  const handleKeyChange = (songOn: SongsOnSetlistClient, key: string) => {
    if (!isNote(key)) return;

    const newSongOn = { ...songOn, key, _updated: !songOn._added };
    setSongsOn([...songsOn.map((_songOn) => (_songOn.id === newSongOn.id ? newSongOn : _songOn))]);
  };

  return (
    <main className="content my-10 max-w-3xl">
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
          {songsOn
            .filter((sO) => !sO._deleted)
            .map((songOn) => (
              <li
                key={songOn.id}
                className="flex w-full justify-between gap-2 border-t border-t-neutral-200 px-2 py-1 text-left"
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
                  {NOTES_ALL.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  key={songOn.id}
                  onClick={() => handleSongOnRemove(songOn.id)}
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
