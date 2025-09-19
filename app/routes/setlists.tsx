import { Link } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { SetlistListItem } from '~/components/SetlistListItem';
import { prisma } from '~/domain/prisma';
import type { Route } from './+types/setlists';

export const loader = async () => {
  const setlists = await prisma.setlist.findMany();
  return { setlists };
};

export default function SetsRoute({ loaderData }: Route.ComponentProps) {
  const { setlists } = loaderData;
  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">Setlists</h1>

      <ButtonLink to="/setlists/new/edit">+ Add Setlist</ButtonLink>

      <ul className="mt-4">
        {setlists.map((setlist) => (
          <Link key={setlist.id} to={`/setlists/${setlist.id}`} className="clickable block">
            <SetlistListItem setlist={setlist} />
          </Link>
        ))}
      </ul>
    </main>
  );
}
