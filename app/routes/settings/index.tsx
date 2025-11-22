import { href } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import {
  ACTION_IMPORT_SONG_LIB,
  FIELD_SONG_LIB,
  SettingsImportSongLib,
} from '~/components/SettingsImportSongLib';
import { importSongFile } from '~/domain/song/importSongs.server';
import type { Route } from './+types';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (values._action === ACTION_IMPORT_SONG_LIB) {
    return importSongFile(values[FIELD_SONG_LIB]);
  }
}

export default function SettingsRoute({ actionData }: Route.ComponentProps) {
  return (
    <section className="my-8">
      <h2 className="text-2xl">Import / Export Song Library</h2>
      <ButtonLink
        to={href('/settings/download-song-lib')}
        reloadDocument
        className="mt-4"
      >
        Download Song Library Backup
      </ButtonLink>

      <SettingsImportSongLib statusMsg={actionData} />

      <ButtonLink to={href('/auth/logout')} className="mt-4">
        Logout
      </ButtonLink>
    </section>
  );
}
