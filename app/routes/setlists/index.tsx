import { AddIcon } from '@proicons/react';
import { useMemo, useState } from 'react';
import { href, Link } from 'react-router';
import { ButtonLink } from '~/components/button/ButtonLink';
import { FabContainer } from '~/components/button/FabContainer';
import { Textbox } from '~/components/form/Textbox';
import { ListItem } from '~/components/list-item/ListItem';
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

export default function SetlistsRoute({ loaderData }: Route.ComponentProps) {
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
      <h1 className="h1 mb-4">Setlists</h1>

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
            to={href('/setlists/:slug', { slug: setlist.slug })}
            className="clickable block"
          >
            <ListItem>
              <div>{setlist.name}</div>
              {setlist.songAmount}
            </ListItem>
          </Link>
        ))}
      </ul>

      <FabContainer>
        <ButtonLink
          to={href('/setlists/:slug/edit', { slug: 'new' })}
          variant="primary"
        >
          <AddIcon size={20} />
          Add Setlist
        </ButtonLink>
      </FabContainer>
    </main>
  );
}
