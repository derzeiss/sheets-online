import type { ZodObject, ZodType } from 'zod';

export type ToZodSchema<T> = ZodObject<{
  [K in keyof Partial<T>]: K extends keyof T ? ZodType<T[K]> : never;
}>;
