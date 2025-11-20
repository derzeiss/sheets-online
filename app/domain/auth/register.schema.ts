import z from 'zod';

const passwordSchema = z
  .string()
  .min(8, { message: 'Your password should be at least 8 characters long.' })
  .max(20, { message: 'Your password should not be longer that 20 characters.' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Your password should contain at least one uppercase letter.',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Your password should contain at least one lowercase letter.',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Your password should contain at least one digit',
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: 'Your password should contain at least one special character (!@#$%^&*)',
  });

export const registerFormSchema = z
  .object({
    name: z.string('Please provide a name'),
    email: z.email('Please enter a valid E-Mail-Address'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords don't match.",
    path: ['confirmPassword'],
  });

export type UserRegisterDto = z.infer<typeof registerFormSchema>;
