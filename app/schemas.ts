import { z } from 'zod';

export const songSchema = z.object({
  title: z.string(),
  artist: z.string().nullish(),
  key: z.string().nullish(),
  tempo: z.string().nullish(),
  time: z.string().nullish(),
  ccli: z.string().nullish(),
  prosong: z.string(),
});

export const songsOnSetlistSchema = z.object({
  key: z.string().nullish(),
  order: z.number(),
  songId: z.string(),
  setlistId: z.string(),
});

export const setlistsSchema = z.object({
  name: z.string(),
  songAmount: z.coerce.number(),
  songs: z.array(songsOnSetlistSchema),
});
