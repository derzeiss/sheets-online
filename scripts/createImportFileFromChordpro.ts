import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { parseSong } from '../app/domain/chordpro-parser/parser';

/**
 * Import multiple .chordpro files.
 * This script
 *  1. takes all files in ./songs (no matter the file ending!)
 *  2. parses them as chordpro
 *  3. creates a combined ./out.json file that you can
 *  4. import via the web interface.
 */

const DIR = './songs';

const dir = readdirSync(DIR);
const json = dir.map((fPath) => {
  const prosong = readFileSync(path.join(DIR, fPath)).toString();
  const jsong = parseSong(prosong);
  return {
    id: crypto.randomUUID(),
    title: jsong.meta.title,
    artist: jsong.meta.artist || jsong.meta.subtitle,
    key: jsong.meta.key,
    tempo: jsong.meta.tempo,
    time: jsong.meta.time,
    ccli: jsong.meta.ccli,
    prosong,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

writeFileSync('./out.json', JSON.stringify(json));
