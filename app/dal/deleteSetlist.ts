import { redirect } from 'react-router';
import { prisma } from '~/modules/prisma';

export async function deleteSetlist(id: string) {
  const deleteSongsOn = prisma.songsOnSetlist.deleteMany({ where: { setlistId: id } });
  const deleteSetlist = prisma.setlist.delete({ where: { id } });
  await prisma.$transaction([deleteSongsOn, deleteSetlist]);
  return redirect('/setlists');
}
