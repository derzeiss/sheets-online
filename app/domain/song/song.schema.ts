import z from 'zod';

export const songSchema = z.object({
  title: z.string(),
  artist: z.string().nullish(),
  key: z.string().nullish(),
  tempo: z.string().nullish(),
  time: z.string().nullish(),
  ccli: z.string().nullish(),
  prosong: z.string(),
});
