import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { SetlistListItem } from '~/components/SetlistListItem';
import { Textbox } from '~/components/Textbox';
import { requireUser } from '~/domain/auth/authMiddleware.server';
import { prisma } from '~/domain/prisma';
import type { Route } from './+types';

export const middleware: Route.MiddlewareFunction[] = [requireUser];

export const loader = async () => {
  const setlists = await prisma.setlist.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });
  return { setlists };
};

export default function SetsRoute({ loaderData }: Route.ComponentProps) {
  const { setlists } = loaderData;

  // add songs query
  const [setlistQuery, setSetlistQuery] = useState('');
  const setlistsFiltered = useMemo(() => {
    if (setlistQuery.length < 2) return setlists;
    const queryLower = setlistQuery.toLowerCase();
    return setlists.filter(
      (setlists) => setlists.name.toLowerCase().indexOf(queryLower) > -1,
    );
  }, [setlistQuery]);

  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">Setlists</h1>

      <ButtonLink to="/setlists/new/edit">+ Add Setlist</ButtonLink>

      <Textbox
        className="mt-3"
        value={setlistQuery}
        onChange={(ev) => setSetlistQuery(ev.target.value)}
        placeholder="Search setlists..."
      />

      <ul className="mt-4">
        {setlistsFiltered.map((setlist) => (
          <Link
            key={setlist.id}
            to={`/setlists/${setlist.slug}`}
            className="clickable block"
          >
            <SetlistListItem setlist={setlist} />
          </Link>
        ))}
      </ul>
    </main>
  );
}
