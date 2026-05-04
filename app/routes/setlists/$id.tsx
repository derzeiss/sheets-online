import {
  ArrowLeftIcon,
  DeleteIcon,
  PencilIcon,
  PlayIcon,
  QrCodeIcon,
} from '@proicons/react';
import QRCode from 'qrcode';
import { useRef } from 'react';
import { data, Form, href, Link } from 'react-router';
import { Button } from '~/components/button/Button';
import { ButtonLink } from '~/components/button/ButtonLink';
import { DoubleConfirmBtn } from '~/components/button/DoubleConfirmBtn';
import { FabContainer } from '~/components/button/FabContainer';
import { SongListItem } from '~/components/list-item/SongListItem';
import { TextMeta } from '~/components/TextMeta';
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
  if (!setlist) {
    throw data(`Setlist "${params.slug}" not found.`, { status: 404 });
  }

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

const toggleQrCodeClasses = (el: Element | null | undefined) => {
  if (!el) return;
  // These classes have to be present on the qr-code-container initially so it's hidden
  ['invisible', 'opacity-0', 'translate-y-3', 'scale-95'].forEach((cls) =>
    el.classList.toggle(cls),
  );
};

export default function SetlistRoute({ loaderData }: Route.ComponentProps) {
  const { setlist } = loaderData;
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  const toggleQrCode = () => {
    if (!qrCodeRef.current) return;
    QRCode.toCanvas(qrCodeRef.current, location.href, {
      errorCorrectionLevel: 'H',
      width: QR_CODE_SIZE,
    });
    toggleQrCodeClasses(qrCodeRef.current?.parentElement);
  };

  return (
    <main className="content my-10 max-w-3xl">
      <div className="flex gap-2">
        <ButtonLink to={href('/setlists')} size="sm">
          <ArrowLeftIcon size={20} />
          Back
        </ButtonLink>
        <ButtonLink
          to={href('/setlists/:slug/edit', { slug: setlist.slug })}
          size="sm"
        >
          <PencilIcon size={20} />
          Edit
        </ButtonLink>

        <Form method="post" className="ml-auto">
          <input type="hidden" name="id" value={setlist.id} />
          <input type="hidden" name="_action" value="delete" />
          <DoubleConfirmBtn type="submit" variant="danger" size="sm">
            <DeleteIcon size={20} />
            Delete
          </DoubleConfirmBtn>
        </Form>
      </div>

      <h1 className="h1 mt-8">{setlist.name}</h1>
      <TextMeta>
        {setlist.songAmount} Song{setlist.songAmount !== 1 && 's'}
      </TextMeta>

      <ul className="mt-4">
        {setlist.items.map((item) => (
          <Link
            key={item.id}
            to={
              href('/setlists/:slug/play', { slug: setlist.slug }) +
              `#${item.id}`
            }
            className="clickable block"
          >
            <SongListItem song={{ ...item.song, key: item.key }} />
          </Link>
        ))}
      </ul>

      <FabContainer>
        <div className="invisible absolute right-0 bottom-14 origin-bottom translate-y-3 scale-95 overflow-hidden rounded-3xl opacity-0 transition-all">
          <canvas ref={qrCodeRef} width={QR_CODE_SIZE} height={QR_CODE_SIZE} />
        </div>

        <Button onClick={toggleQrCode}>
          <QrCodeIcon size={20} />
          Share
        </Button>
        <ButtonLink
          to={href('/setlists/:slug/play', { slug: setlist.slug })}
          variant="primary"
        >
          <PlayIcon size={20} />
          Play
        </ButtonLink>
      </FabContainer>
    </main>
  );
}
