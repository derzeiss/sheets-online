import { ButtonLink } from '~/components/ButtonLink';
import {
  ACTION_IMPORT_SONG_LIB,
  actionImportSongs,
  SettingsImportSongLib,
} from '~/components/SettingsImportSongLib';
import type { Route } from './+types/settings';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (values._action === ACTION_IMPORT_SONG_LIB) {
    return actionImportSongs(values);
  }
}

export default function SettingsRoute({ actionData }: Route.ComponentProps) {
  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">Settings</h1>

      <section className="my-8">
        <h2 className="text-2xl">Import / Export Song Library</h2>
        <ButtonLink to="download-song-lib-backup" reloadDocument className="mt-4">
          Download Song Library Backup
        </ButtonLink>

        <SettingsImportSongLib actionData={actionData} />
      </section>
    </main>
  );
}
