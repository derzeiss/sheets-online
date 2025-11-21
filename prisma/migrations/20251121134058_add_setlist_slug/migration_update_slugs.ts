import { PrismaClient } from '@prisma/client';

async function main() {
  console.log('Fetching setlists');
  const setlists = await prisma.setlist.findMany();

  console.log(`Got ${setlists.length} setlists. Starting to change slugs`);

  for (let setlist of setlists) {
    const slug = await findNextUniqueSlug(prisma.setlist.findUnique, toSlug(setlist.name));
    console.log(`Generated slug "${slug}" for "${setlist.name}"`);

    await prisma.setlist.update({
      where: {
        id: setlist.id,
      },
      data: {
        slug,
      },
    });
  }

  console.log(`Successfully updated ${setlists.length} setlists.`);
}

// ---- DEPS ----

// copied from '~/domain/prisma'
const prisma = new PrismaClient();

// copied from '~/domain/utils/findNextUniqueSlug.server'
const findNextUniqueSlug = async <T extends Function>(
  findUnique: T,
  baseSlug: string,
  suffix = 0,
): Promise<string> => {
  // don't allow 'new' as we use it for creating a new blank setlist
  if (suffix === 0 && baseSlug === 'new') {
    return findNextUniqueSlug(findUnique, baseSlug, suffix + 1);
  }
  let slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;

  const existingRecord = await findUnique({ where: { slug } });

  if (existingRecord) return findNextUniqueSlug(findUnique, baseSlug, suffix + 1);
  if (suffix >= 500) throw new Error('Tried 500 times, no slug found.'); // TODO: this will some day throw

  return slug;
};

// copied from '~/domain/utils/toSlug'
function toSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  replacements.forEach(([from, to]) => {
    str = str.replaceAll(from, to);
  });

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+|-+$/g, ''); // remove leading and trailing dashes

  return str;
}

const replacements = [
  ['à', 'a'],
  ['á', 'a'],
  ['ä', 'ae'],
  ['â', 'a'],
  ['è', 'e'],
  ['é', 'e'],
  ['ë', 'e'],
  ['ê', 'e'],
  ['ì', 'i'],
  ['í', 'i'],
  ['ï', 'i'],
  ['î', 'i'],
  ['ò', 'o'],
  ['ó', 'o'],
  ['ö', 'oe'],
  ['ô', 'o'],
  ['ù', 'u'],
  ['ú', 'u'],
  ['ü', 'ue'],
  ['û', 'u'],
  ['ñ', 'n'],
  ['ç', 'c'],
  ['·', '-'],
  ['/', '-'],
  ['_', '-'],
  [',', '-'],
  [':', '-'],
  [';', '-'],
];

main();
