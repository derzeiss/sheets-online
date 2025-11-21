import { PrismaClient, type Song } from '@prisma/client';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { parseSong } from '~/domain/chordpro-parser/parser';
import { songSchema } from '~/domain/song/song.schema';

const dir = path.join(import.meta.dirname, 'songs');
const prisma = new PrismaClient();

let logging = {
  created: 0,
  skipped: 0,
  total: 0,
};

await Promise.all(
  readdirSync(dir).map(async (file) => {
    const prosong = readFileSync(path.join(dir, file)).toString();
    const { meta } = parseSong(prosong);

    let song;
    try {
      song = songSchema.parse({ ...meta, prosong });
    } catch (err) {
      console.error(`Error while parsing song. Song data:`);
      console.log(meta);
      console.log(prosong);
      console.log(err);
      return;
    }

    const existingSong = await prisma.song.findFirst({ where: { title: song.title } });

    logging.total++;

    if (existingSong) {
      console.log(`Song "${song.title}" found in DB; skipping`);
      logging.skipped++;
      return;
    }
    await prisma.song.create({ data: song });
    logging.created++;
  }),
);

console.log(`Created: ${logging.created}. Skipped: ${logging.skipped}. Total: ${logging.total}.`);
