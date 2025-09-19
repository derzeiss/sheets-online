import { prisma } from '~/domain/prisma';

export async function loader() {
  const songs = await prisma.song.findMany({ orderBy: { title: 'asc' } });

  return new Response(JSON.stringify(songs), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="song-library-${new Date().toLocaleDateString()}.json"`,
    },
  });
}
