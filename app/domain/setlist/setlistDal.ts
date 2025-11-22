import type { Prisma, Setlist, SetlistItem } from '@prisma/client';
import { data, redirect } from 'react-router';
import { prisma } from '~/domain/prisma';
import type { ClientListItem } from '~/domain/utils/useClientList';
import type { FormValues } from '~/types/FormValues';
import { findNextUniqueSlug } from '../utils/findNextUniqueSlug.server';
import { toSlug } from '../utils/toSlug';
import { setlistItemSchema, setlistSchema } from './setlist.schema';

export async function upsertSetlist(values: FormValues) {
  if (typeof values.items !== 'string') {
    return data('"setlistItems" must be JSON string.');
  }
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
    const slug = await findNextUniqueSlug(
      prisma.setlist.findUnique,
      toSlug(setlist.name),
    );

    querySetlist = prisma.setlist.create({
      data: {
        ...setlist,
        id: undefined,
        slug,
        items: { create: itemsAdded },
        createdAt: undefined,
        updatedAt: undefined,
      },
    });
  } else {
    querySetlist = prisma.setlist.update({
      where: { id: setlist.id },
      data: {
        ...setlist,
        items: { create: itemsAdded },
        createdAt: undefined,
        updatedAt: new Date(),
      },
    });
  }

  const results = await prisma.$transaction([
    // create / update setlist
    querySetlist,
    // delete items
    prisma.setlistItem.deleteMany({
      where: {
        id: { in: itemsDeleted.map((item) => item.id) },
        setlistId: setlist.id,
      },
    }),
    // update items
    ...itemsUpdated.map((item) =>
      prisma.setlistItem.update({ where: { id: item.id }, data: item }),
    ),
  ]);

  if (!results.length) return redirect('/setlists');
  return redirect(`/setlists/${results[0].slug}`);
}

export async function deleteSetlist(id: string) {
  const deleteItems = prisma.setlistItem.deleteMany({
    where: { setlistId: id },
  });
  const deleteSetlist = prisma.setlist.delete({ where: { id } });
  await prisma.$transaction([deleteItems, deleteSetlist]);
  return redirect('/setlists');
}
