import { Prisma } from '@prisma/client';

export type SetlistWithItemWithSong = Prisma.SetlistGetPayload<{
  include: typeof setlistWithItemsWithSongInclude;
}>;

export const setlistWithItemsWithSongInclude = Prisma.validator<Prisma.SetlistInclude>()({
  items: {
    include: { song: true },
    orderBy: { order: 'asc' },
  },
});

export type SetlistItemWithSong = Prisma.SetlistItemGetPayload<{
  include: { song: true };
}>;
