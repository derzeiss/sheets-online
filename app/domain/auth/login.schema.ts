import z from 'zod';

export const loginFormSchema = z.object({
  email: z.string(),
  password: z.string(),
  redirectTo: z.string().optional(),
});

export type UserLoginDto = z.infer<typeof loginFormSchema>;
