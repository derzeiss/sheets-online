import type { Setlist, SetlistItem } from '@prisma/client';
import z from 'zod';
import type { ToZodSchema } from '~/types/ToZodSchema';

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
