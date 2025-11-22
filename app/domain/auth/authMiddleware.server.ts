import type { UserRole } from '@prisma/client';
import { createContext, redirect, type MiddlewareFunction } from 'react-router';
import { hrefQuery } from '../utils/hrefQuery';
import { getSession } from './session.server';
import type { SessionUser } from './types/SessionUser';

export const userContext = createContext<SessionUser | null>(null);

export const useUserSessionMiddleware: MiddlewareFunction<Response> = async ({
  request,
  context,
}) => {
  const session = await getSession(request);
  const user = session.get('user');
  if (user) context.set(userContext, user);
};

export const requireUser: MiddlewareFunction<Response> = async ({ request, context }) => {
  const user = context.get(userContext);

  if (!user) {
    throw redirect(hrefQuery('/auth/login', { query: { redirect: request.url } }));
  }
};

export const requireRole: (...roles: UserRole[]) => MiddlewareFunction<Response> = (roles) => {
  return async ({ context }) => {
    const user = context.get(userContext);

    if (!user || !roles.includes(user.role)) {
      throw redirect('/404');
    }
  };
};
