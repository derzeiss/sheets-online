import type { Prisma, Setlist } from '@prisma/client';
import { data, redirect } from 'react-router';
import { prisma } from '~/modules/prisma';
import { setlistSchema, songsOnSetlistSchema, type SongsOnSetlistClientDTO } from '~/schemas';
import type { FormValues } from '~/types/FormValues';

export async function upsertSetlist(values: FormValues) {
  if (typeof values.songs !== 'string') return data('"songs" must be JSON string.');
  const songs: SongsOnSetlistClientDTO[] = JSON.parse(values.songs);

  values.songAmount = '0';
  const setlist = setlistSchema.parse({
    ...values,
    songAmount: '0',
    songs: songs.filter((so) => !so._deleted).map((so) => songsOnSetlistSchema.parse(so)),
  });

  const songsOnAdded = songs
    .filter((so) => so._added)
    .map((so) => ({
      key: so.key || null,
      order: so.order,
      songId: so.songId,
    }));
  const songsOnDeleted = songs
    .filter((so) => so._deleted)
    .map((so) => songsOnSetlistSchema.parse(so));
  const songsOnUpdated = songs
    .filter((so) => so._updated)
    .map((so) => songsOnSetlistSchema.parse(so));

  setlist.songAmount = songs.length - songsOnDeleted.length;

  let querySetlist: Prisma.Prisma__SetlistClient<Setlist>;
  if (setlist.id === 'new') {
    querySetlist = prisma.setlist.create({
      data: {
        ...setlist,
        id: undefined,
        songs: { create: songsOnAdded },
      },
    });
  } else {
    querySetlist = prisma.setlist.update({
      where: { id: setlist.id },
      data: {
        ...setlist,
        songs: { create: songsOnAdded, delete: songsOnDeleted },
      },
    });
  }

  // TODO: There's a 500 bug when you edit a song and delete it afterwards, but I can't find it
  const results = await prisma.$transaction([
    querySetlist,
    ...songsOnUpdated.map((so) => prisma.songsOnSetlist.update({ where: { id: so.id }, data: so })),
  ]);

  if (!results.length) return redirect('/setlists');
  return redirect(`/setlists/${results[0].id}`);
}

export async function deleteSetlist(id: string) {
  const deleteSongsOn = prisma.songsOnSetlist.deleteMany({ where: { setlistId: id } });
  const deleteSetlist = prisma.setlist.delete({ where: { id } });
  await prisma.$transaction([deleteSongsOn, deleteSetlist]);
  return redirect('/setlists');
}
