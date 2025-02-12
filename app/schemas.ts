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

export const songsOnSetlistClientSchema = z.object({
  id: z.string(),
  key: z.string().nullish(),
  order: z.number(),
  songId: z.string(),
  setlistId: z.string(),
  _deleted: z.boolean().nullish(),
  _added: z.boolean().nullish(),
  _updated: z.boolean().nullish(),
});
export type SongsOnSetlistClientDTO = z.infer<typeof songsOnSetlistClientSchema>;

export const songsOnSetlistSchema = z.object({
  id: z.string(),
  key: z.string().nullish(),
  order: z.number(),
  songId: z.string(),
  setlistId: z.string(),
});

export const setlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  songAmount: z.coerce.number(),
  songs: z.array(songsOnSetlistClientSchema),
});
