import { hash } from 'node:crypto';
import { href, redirect } from 'react-router';
import { SYS_ADMIN_EMAIL } from '~/config';
import { prisma } from '../prisma';
import type { UserLoginDto } from './login.schema';
import type { UserRegisterDto } from './register.schema';
import { commitSession, destroySession, getSession } from './session.server';
import type { ErrorsFor } from './types/ErrorsFor';

const LOGIN_ERR_MSG =
  "Sorry we couldn't log you in. Please check your credentials and try again.";

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  return user;
}

export async function register(
  request: Request,
  userDto: UserRegisterDto,
): Promise<Response | ErrorsFor<UserRegisterDto>> {
  const { name, email, password } = userDto;
  const existingUser = await getUserByEmail(email);
  if (existingUser) return { errors: { email: 'Email already exists' } };

  const isSysAdmin = email === SYS_ADMIN_EMAIL;

  // Create a new user
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: { create: { hash: hash('sha256', password) } },
        isActive: isSysAdmin,
        role: isSysAdmin ? 'admin' : 'default',
      },
    });

    if (!isSysAdmin) {
      return redirect(href('/auth/waiting-for-approval'));
    }

    const authSession = await getSession(request);
    authSession.set('user', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    return redirect(href('/settings'), {
      headers: {
        'Set-Cookie': await commitSession(authSession),
      },
    });
  } catch (err) {
    return {
      errors: { _form: 'Error while creating new user.' },
    };
  }
}

export async function login(
  request: Request,
  loginData: UserLoginDto,
  redirectUrl = '/',
): Promise<Response | ErrorsFor<UserLoginDto>> {
  const user = await prisma.user.findUnique({
    where: {
      email: loginData.email,
      password: { hash: hash('sha256', loginData.password) },
    },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      role: true,
    },
  });

  if (!user) {
    return { errors: { email: LOGIN_ERR_MSG } };
  }
  if (!user.isActive) return redirect(href('/auth/waiting-for-approval'));

  const authSession = await getSession(request);
  authSession.set('user', {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await commitSession(authSession),
    },
  });
}

export async function logout(request: Request, redirectUrl = '/auth/login') {
  const authSession = await getSession(request);

  return redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await destroySession(authSession),
    },
  });
}
