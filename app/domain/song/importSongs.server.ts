import type { Prisma, Song } from '@prisma/client';
import { prisma } from '../prisma';
import type { StatusMessage } from '~/types/StatusMessage';

export const importSongFile = async (
  songsFormValue: FormDataEntryValue,
): Promise<StatusMessage | void> => {
  if (typeof songsFormValue !== 'string') return;
  try {
    const songs = JSON.parse(songsFormValue) satisfies Song[];
    const amountImported = await performDbImport(songs);
    if (amountImported === 0) {
      return { status: 'info', msg: 'No new songs found in backup.' };
    }
    return {
      status: 'success',
      msg: `Successfully imported ${amountImported} songs.`,
    };
  } catch (err) {
    return {
      status: 'error',
      msg: `Error while importing songs. Please make sure you uploaded a valid song-lib file.`,
    };
    // TODO: Log error
  }
};

const performDbImport = async (songs: Song[]) => {
  const existingSongs = await prisma.song.findMany({
    select: {
      title: true,
      artist: true,
    },
  });
  const existingSongsSet = new Set(
    existingSongs.map((song) => `${song.title}≥${song.artist}`),
  ); // using unusual char as divider on purpose
  const queries: Prisma.Prisma__SongClient<Song>[] = [];

  songs.forEach((song) => {
    const songKey = `${song.title}≥${song.artist}`;
    if (existingSongsSet.has(songKey)) return;
    queries.push(prisma.song.create({ data: song }));
  });
  if (queries.length > 0) {
    await prisma.$transaction(queries);
  }
  return queries.length;
};
