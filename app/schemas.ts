import { type Setlist, type SetlistItem, type Song } from '@prisma/client';
import { z, ZodObject, ZodType } from 'zod';

type ToZodSchema<T> = ZodObject<{
  [K in keyof Partial<T>]: K extends keyof T ? ZodType<T[K]> : never;
}>;

export const songSchema = z.object({
  title: z.string(),
  artist: z.string().nullish(),
  key: z.string().nullish(),
  tempo: z.string().nullish(),
  time: z.string().nullish(),
  ccli: z.string().nullish(),
  prosong: z.string(),
});

export const setlistItemSchema = z.object({
  id: z.string(),
  key: z.string().nullable(),
  order: z.number(),
  songId: z.string(),
  setlistId: z.string(),
}) satisfies ToZodSchema<SetlistItem>;

export const setlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  songAmount: z.coerce.number(),
}) satisfies ToZodSchema<Setlist>;
