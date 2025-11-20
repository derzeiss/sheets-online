import type { Prisma, Setlist, SetlistItem } from '@prisma/client';
import { data, redirect } from 'react-router';
import { prisma } from '~/domain/prisma';
import type { FormValues } from '~/types/FormValues';
import type { ClientListItem } from '~/domain/utils/useClientList';
import { setlistItemSchema, setlistSchema } from './setlist.schema';

export async function upsertSetlist(values: FormValues) {
  if (typeof values.items !== 'string') return data('"setlistItems" must be JSON string.');
  const setlistItems: ClientListItem<SetlistItem>[] = JSON.parse(values.items);

  const itemsAdded = setlistItems
    .filter((item) => item._added)
    .map((item) => ({
      key: item.key,
      order: item.order,
      songId: item.songId,
    }));
  const itemsDeleted = setlistItems
    .filter((item) => item._deleted)
    .map((item) => setlistItemSchema.parse(item));
  const itemsUpdated = setlistItems
    .filter((item) => item._updated)
    .map((item) => setlistItemSchema.parse(item));

  const setlist = setlistSchema.parse({
    ...values,
    songAmount: setlistItems.length - itemsDeleted.length,
  });

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
        items: { create: itemsAdded },
      },
    });
  }

  const results = await prisma.$transaction([
    // create / update setlist
    querySetlist,
    // delete items
    prisma.setlistItem.deleteMany({
      where: { id: { in: itemsDeleted.map((item) => item.id) }, setlistId: setlist.id },
    }),
    // update items
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
