import { PowerIcon } from '@proicons/react';
import { href } from 'react-router';
import { ButtonLink } from '~/components/button/ButtonLink';
import {
  ACTION_IMPORT_SONG_LIB,
  FIELD_SONG_LIB,
  SettingsImportSongLib,
} from '~/components/SettingsImportSongLib';
import { importSongFile } from '~/domain/song/importSongs.server';
import type { Route } from './+types/general';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (values._action === ACTION_IMPORT_SONG_LIB) {
    return importSongFile(values[FIELD_SONG_LIB]);
  }
}

export default function SettingsGeneralRoute({
  actionData,
}: Route.ComponentProps) {
  return (
    <section className="my-8 space-y-4">
      <h2 className="h2">Import / Export Song Library</h2>
      <ButtonLink to={href('/settings/download-song-lib')} reloadDocument>
        Download Song Library Backup
      </ButtonLink>
      <SettingsImportSongLib statusMsg={actionData} />

      <h2 className="h2">Logout</h2>
      <ButtonLink to={href('/auth/logout')}>
        <PowerIcon size={20} />
        Logout
      </ButtonLink>
    </section>
  );
}
