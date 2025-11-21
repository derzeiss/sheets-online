import { href } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import {
  ACTION_IMPORT_SONG_LIB,
  actionImportSongs,
  SettingsImportSongLib,
} from '~/components/SettingsImportSongLib';
import type { Route } from './+types';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (values._action === ACTION_IMPORT_SONG_LIB) {
    return actionImportSongs(values);
  }
}

export default function SettingsRoute({ actionData }: Route.ComponentProps) {
  return (
    <section className="my-8">
      <h2 className="text-2xl">Import / Export Song Library</h2>
      <ButtonLink to={href('/settings/download-song-lib')} reloadDocument className="mt-4">
        Download Song Library Backup
      </ButtonLink>

      <SettingsImportSongLib actionData={actionData} />

      <ButtonLink to={href('/auth/logout')} className="mt-4">
        Logout
      </ButtonLink>
    </section>
  );
}
