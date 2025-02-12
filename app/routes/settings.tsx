import { ButtonLink } from '~/components/ButtonLink';
import type { Route } from './+types/settings';

export default function SettingsRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">Settings</h1>

      <ButtonLink to="download-song-lib-backup" reloadDocument>
        Download Song Library Backup
      </ButtonLink>
    </main>
  );
}
