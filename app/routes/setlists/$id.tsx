import QRCode from 'qrcode';
import { useRef } from 'react';
import { data, Form, Link } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { ConfirmButton } from '~/components/ConfirmButton';
import { SongListItem } from '~/components/SongListItem';
import { prisma } from '~/domain/prisma';
import { deleteSetlist } from '~/domain/setlist/setlistDal';
import { setlistWithItemsWithSongInclude } from '~/prismaExtensions';
import type { Route } from './+types/$id';

const QR_CODE_SIZE = 400;

export async function loader({ params }: Route.LoaderArgs) {
  const setlist = await prisma.setlist.findFirst({
    where: { slug: params.slug },
    include: setlistWithItemsWithSongInclude,
  });
  if (!setlist) throw data(`Setlist "${params.slug}" not found.`, { status: 404 });

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
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  const toggleQrCode = () => {
    if (!qrCodeRef.current) return;
    QRCode.toCanvas(qrCodeRef.current, location.href, {
      errorCorrectionLevel: 'H',
      width: QR_CODE_SIZE,
    });
    qrCodeRef.current.classList.toggle('hidden');
  };

  return (
    <main className="content my-10 max-w-3xl">
      <div className="mb-4 flex gap-2">
        <ButtonLink to="/setlists">← Back</ButtonLink>
        <ButtonLink to="edit">Edit Setlist</ButtonLink>
        <ButtonLink to="play">▶︎ Play</ButtonLink>
        <Button onClick={toggleQrCode}>↪︎ Share</Button>

        <Form method="post" className="ml-auto">
          <input type="hidden" name="id" value={setlist.id} />
          <input type="hidden" name="_action" value="delete" />
          <ConfirmButton className="bg-red-200" type="submit">
            Delete Setlist
          </ConfirmButton>
        </Form>
      </div>

      <canvas className="hidden" ref={qrCodeRef} width={QR_CODE_SIZE} height={QR_CODE_SIZE} />

      <h1 className="text-4xl">{setlist.name}</h1>
      <div className="text-neutral-600">{setlist.songAmount} Songs</div>

      <ul className="mt-4">
        {setlist.items.map((item) => (
          <Link key={item.id} to={`play#${item.id}`} className="clickable block">
            <SongListItem song={{ ...item.song, key: item.key }} />
          </Link>
        ))}
      </ul>
    </main>
  );
}
