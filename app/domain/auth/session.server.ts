import { createCookieSessionStorage } from 'react-router';
import type { SessionUser } from './types/SessionUser';
import { COOKIE_SECRET } from '~/config';

type SessionData = {
  user: SessionUser;
};

type SessionFlashData = {
  error: string;
};

const cookieSessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: '_session',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secrets: [COOKIE_SECRET],
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
});
export const { commitSession, destroySession } = cookieSessionStorage;

export const getSession = (request: Request) =>
  cookieSessionStorage.getSession(request.headers.get('Cookie'));

export const getUserFromSession = async (request: Request) => {
  const session = await getSession(request);
  const user = session.get('user');
  return user || null;
};
