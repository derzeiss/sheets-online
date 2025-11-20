import type { User } from '@prisma/client';

export type SessionUser = Pick<User, 'id' | 'name' | 'email'>;
