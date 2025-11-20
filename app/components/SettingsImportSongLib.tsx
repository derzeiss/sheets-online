import { useState, useEffect, type ChangeEvent, type FormEvent, type FC } from 'react';
import { useSubmit, Form } from 'react-router';
import { cx } from '~/domain/utils/cx';
import { useBasicStateMachine } from '~/domain/utils/useStateMachine';
import { Button } from './Button';
import type { Prisma, Song } from '@prisma/client';
import { prisma } from '~/domain/prisma';
import type { Route } from '../routes/settings/+types';

export const ACTION_IMPORT_SONG_LIB = 'import-song-lib-backup';
const FIELD_SONG_LIB = 'song-lib-json';

export const actionImportSongs = async (values: { [k: string]: FormDataEntryValue }) => {
  if (typeof values[FIELD_SONG_LIB] !== 'string') return;
  try {
    const songs = JSON.parse(values[FIELD_SONG_LIB]) satisfies Song[];
    const amountImported = await performDbImport(songs);
    if (amountImported === 0) return { status: 'info', msg: 'No new songs found in backup.' };
    return { status: 'success', msg: `Successfully imported ${amountImported} songs.` };
  } catch (err) {
    console.error(err);
    return {
      status: 'error',
      msg: `Error while importing songs. Please make sure you uploaded a valid song-lib file.`,
    };
    // TODO: Log error
  }
};

const performDbImport = async (songs: Song[]) => {
  const existingSongs = await prisma.song.findMany({
    select: {
      title: true,
      artist: true,
    },
  });
  const existingSongsSet = new Set(existingSongs.map((song) => `${song.title}≥${song.artist}`)); // using unusual char as divider on purpose

  const queries: Prisma.Prisma__SongClient<Song>[] = [];
  songs.forEach((song) => {
    const songKey = `${song.title}≥${song.artist}`;
    if (existingSongsSet.has(songKey)) return;
    queries.push(prisma.song.create({ data: song }));
  });

  if (queries.length > 0) {
    await prisma.$transaction(queries);
  }
  return queries.length;
};

interface Props {
  actionData: Route.ComponentProps['actionData'];
}

export const SettingsImportSongLib: FC<Props> = ({ actionData }) => {
  const submit = useSubmit();
  const [songLib, setSongLib] = useState<{ name: string; data?: string }>({
    name: '',
  });
  const { state, msg, nextState } = useBasicStateMachine();

  useEffect(() => {
    if (!actionData) return;
    if (
      actionData.status === 'info' ||
      actionData.status === 'success' ||
      actionData.status === 'error'
    ) {
      return nextState(actionData.status, actionData.msg);
    }
  }, [actionData]);

  const handleFileUploadChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (!files) return;
    const file = files[0];

    new Response(file) // read file content
      .json()
      .then((songs) => {
        setSongLib({ name: file.name, data: songs });
        nextState('initial');
      })
      .catch((err) => {
        console.error(`Couldn't parse json`, err);
        nextState('error', `Couldn't read song-lib file. Please make sure it's a valid json file.`);
      });
  };

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!songLib.data) return;
    const formData = new FormData();
    formData.set('_action', ACTION_IMPORT_SONG_LIB);
    formData.set(FIELD_SONG_LIB, JSON.stringify(songLib.data));
    submit(formData, { method: 'post' });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <label className="mt-4 block">
          <span className="btn">Import song-library from file</span>
          <input
            name="tmp_song-file"
            type="file"
            accept="application/json"
            className="pointer-events-none absolute opacity-0"
            onChange={handleFileUploadChange}
          />
          {songLib.data && (
            <div className="mt-3 w-fit border p-4">
              <code className="bg-neutral-100 p-1">{songLib.name}</code>
              <br />
              <code className="bg-neutral-100 p-1">{songLib.data.length}</code> songs
              <br />
              <Button className="mt-2">Perform Import</Button>
            </div>
          )}
        </label>
      </Form>
      {state !== 'initial' && (
        <div
          className={cx('mt-3 w-fit p-1', {
            'bg-green-100': state === 'success',
            'bg-sky-100': state === 'info',
            'bg-red-100': state === 'error',
          })}
        >
          {msg}
        </div>
      )}
    </>
  );
};
