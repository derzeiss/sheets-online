import { prisma } from '../../../app/domain/prisma';
import { findNextUniqueSlug } from '../../../app/domain/utils/findNextUniqueSlug.server';
import { toSlug } from '../../../app/domain/utils/toSlug';

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

main();
