import { createContext, redirect, type MiddlewareFunction } from 'react-router';
import { hrefQuery } from '../utils/hrefQuery';
import { getSession } from './session.server';
import type { SessionUser } from './types/SessionUser';

export const userContext = createContext<SessionUser | null>(null);

export const requireUser: MiddlewareFunction<Response> = async ({ request, context }, next) => {
  const session = await getSession(request);
  const user = session.get('user');

  if (!user) {
    throw redirect(hrefQuery('/auth/login', { query: { redirect: request.url } }));
  }

  context.set(userContext, user);

  return next();
};
