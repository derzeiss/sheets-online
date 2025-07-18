import type { Prisma, Setlist } from '@prisma/client';
import { data, redirect } from 'react-router';
import { prisma } from '~/modules/prisma';
import { setlistItemSchema, setlistSchema, type SetlistItemClientDTO } from '~/schemas';
import type { FormValues } from '~/types/FormValues';

export async function upsertSetlist(values: FormValues) {
  if (typeof values.setlistItems !== 'string') return data('"setlistItems" must be JSON string.');
  const setlistItems: SetlistItemClientDTO[] = JSON.parse(values.setlistItems);

  values.songAmount = '0';
  const setlist = setlistSchema.parse({
    ...values,
    songAmount: '0',
    items: setlistItems
      .filter((item) => !item._deleted)
      .map((item) => setlistItemSchema.parse(item)),
  });

  const itemsAdded = setlistItems
    .filter((item) => item._added)
    .map((item) => ({
      key: item.key || null,
      order: item.order,
      songId: item.songId,
    }));
  const itemsDeleted = setlistItems
    .filter((item) => item._deleted)
    .map((item) => setlistItemSchema.parse(item));
  const itemsUpdated = setlistItems
    .filter((item) => item._updated)
    .map((item) => setlistItemSchema.parse(item));

  setlist.songAmount = setlistItems.length - itemsDeleted.length;

  let querySetlist: Prisma.Prisma__SetlistClient<Setlist>;
  if (setlist.id === 'new') {
    querySetlist = prisma.setlist.create({
      data: {
        ...setlist,
        id: undefined,
        items: { create: itemsAdded },
      },
    });
  } else {
    querySetlist = prisma.setlist.update({
      where: { id: setlist.id },
      data: {
        ...setlist,
        items: { create: itemsAdded, delete: itemsDeleted },
      },
    });
  }

  // TODO: There's a 500 bug when you edit a song and delete it afterwards, but I can't find it
  const results = await prisma.$transaction([
    querySetlist,
    ...itemsUpdated.map((item) =>
      prisma.setlistItem.update({ where: { id: item.id }, data: item }),
    ),
  ]);

  if (!results.length) return redirect('/setlists');
  return redirect(`/setlists/${results[0].id}`);
}

export async function deleteSetlist(id: string) {
  const deleteItems = prisma.setlistItem.deleteMany({ where: { setlistId: id } });
  const deleteSetlist = prisma.setlist.delete({ where: { id } });
  await prisma.$transaction([deleteItems, deleteSetlist]);
  return redirect('/setlists');
}
