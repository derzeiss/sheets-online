import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { Form, useSubmit } from 'react-router';
import { cx } from '~/domain/utils/cx';
import { useBasicStateMachine } from '~/domain/utils/useStateMachine';
import type { StatusMessage } from '~/types/StatusMessage';
import { Button } from './Button';

export const ACTION_IMPORT_SONG_LIB = 'import-song-lib-backup';
export const FIELD_SONG_LIB = 'song-lib-json';

interface Props {
  statusMsg: StatusMessage | undefined;
}

export const SettingsImportSongLib: FC<Props> = ({ statusMsg }) => {
  const submit = useSubmit();
  const [songLib, setSongLib] = useState<{ name: string; data?: string }>({
    name: '',
  });
  const { state, msg, nextState } = useBasicStateMachine();

  useEffect(() => {
    if (!statusMsg) return;
    if (
      statusMsg.status === 'info' ||
      statusMsg.status === 'success' ||
      statusMsg.status === 'error'
    ) {
      return nextState(statusMsg.status, statusMsg.msg);
    }
  }, [statusMsg]);

  const handleFileUploadChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (!files) return;
    const file = files[0];

    new Response(file) // read file content
      .json()
      .then((songs) => {
        setSongLib({ name: file.name, data: songs });
        nextState('idle');
      })
      .catch(() => {
        nextState('error', `Couldn't read song-lib file. Please make sure it's a valid json file.`);
        // TODO: Log error
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
      {state !== 'idle' && (
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
