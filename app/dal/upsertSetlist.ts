import { redirect } from 'react-router';
import { prisma } from '~/modules/prisma';
import { setlistsSchema } from '~/schemas';
import type { FormValues } from '~/types/FormValues';

export async function upsertSetlist(id: string, values: FormValues) {
  values.songs = JSON.parse(values.songs as string);
  const setlist = setlistsSchema.parse(values);

  if (values.id === 'new') {
    const songsWithoutSetlistId = setlist.songs.map((s) => ({
      order: s.order,
      key: s.key,
      songId: s.songId,
    }));

    const queryData = {
      ...setlist,
      songs: { create: songsWithoutSetlistId },
    };

    await prisma.setlist.create({ data: queryData });
    return redirect('/setlists');
  }
  // else {
  //   await prisma.setlist.update({ where: { id }, data: setlist });
  //   return redirect(`/setlists/${values.id}`);
  // }
}
