import { data, Form } from 'react-router';
import { ButtonLink } from '~/components/ButtonLink';
import { ConfirmButton } from '~/components/ConfirmButton';
import { SongListItem } from '~/components/SongListItem';
import { deleteSetlist } from '~/dal/setlist';
import { prisma } from '~/modules/prisma';
import type { Route } from './+types/setlists_.$id';

export async function loader({ params }: Route.LoaderArgs) {
  const setlist = await prisma.setlist.findFirst({
    where: { id: params.id },
    include: { songs: { include: { song: true } } },
  });
  if (!setlist) throw data(`Setlist "${params.id}" not found.`, { status: 404 });

  return { setlist };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = formData.get('id');

  if (!id || typeof id !== 'string') {
    throw data('No setlist id given.', { status: 400 });
  }

  return deleteSetlist(id);
}

export default function SetlistRoute({ loaderData }: Route.ComponentProps) {
  const { setlist } = loaderData;
  return (
    <main className="content my-10 max-w-3xl">
      <div className="mb-4 flex gap-2">
        <ButtonLink to="/setlists">← Back</ButtonLink>
        <ButtonLink to="edit">Edit Setlist</ButtonLink>
        <ButtonLink to="play">▶︎ Play</ButtonLink>

        <Form method="post" className="ml-auto">
          <input type="hidden" name="id" value={setlist.id} />
          <input type="hidden" name="_action" value="delete" />
          <ConfirmButton className="bg-red-200" type="submit">
            Delete Setlist
          </ConfirmButton>
        </Form>
      </div>

      <h1 className="text-4xl">{setlist.name}</h1>
      <div className="text-neutral-600">{setlist.songAmount} Songs</div>

      <ul className="mt-4">
        {setlist.songs.map((songOn) => (
          <SongListItem key={songOn.id} song={{ ...songOn.song, key: songOn.key }} />
        ))}
      </ul>
    </main>
  );
}
