import type { Setlist } from '@prisma/client';
import { data, redirect } from 'react-router';
import { prisma } from '~/modules/prisma';
import { songSchema } from '~/schemas';
import type { FormValues } from '~/types/FormValues';

export async function upsertSong(id: string, values: FormValues) {
  const song = songSchema.parse(values);

  if (values.id === 'new') {
    await prisma.song.create({ data: song });
    return redirect('/songs');
  } else {
    await prisma.song.update({ where: { id }, data: song });
    return redirect(`/songs/${values.id}`);
  }
}

export async function deleteSong(id: string) {
  const song = await prisma.song.findFirst({
    where: { id },
    include: { setlists: { include: { setlist: true } } },
  });

  if (!song) throw data(`Song "${id}" not found.`, { status: 404 });

  let setlists = song.setlists.map((s) => s.setlist);
  const countPerSetlist: Record<string, number> = {};
  setlists.forEach((s) => {
    if (!countPerSetlist[s.id]) countPerSetlist[s.id] = 0;
    countPerSetlist[s.id]++;
  });
  setlists = setlists.reduce<Setlist[]>((newSetlists, s) => {
    if (countPerSetlist[s.id]) {
      s.songAmount = s.songAmount - countPerSetlist[s.id];
      delete countPerSetlist[s.id];
      newSetlists.push(s);
    }
    return newSetlists;
  }, []);

  await prisma.$transaction([
    prisma.songsOnSetlist.deleteMany({ where: { songId: id } }),
    prisma.song.delete({ where: { id } }),
    ...setlists.map((s) => prisma.setlist.update({ where: { id: s.id }, data: s })),
  ]);
  return redirect('/songs');
}
