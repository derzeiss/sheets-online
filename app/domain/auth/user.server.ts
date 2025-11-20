import { hash } from 'node:crypto';
import { redirect } from 'react-router';
import { prisma } from '../prisma';
import type { UserLoginDto } from './login.schema';
import type { UserRegisterDto } from './register.schema';
import { commitSession, destroySession, getSession } from './session.server';
import type { ErrorsFor } from './types/ErrorsFor';

const LOGIN_ERR_MSG = "Sorry we couldn't log you in. Please check your credentials and try again.";

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
  redirectUrl = '/',
): Promise<Response | ErrorsFor<UserRegisterDto>> {
  const { name, email, password } = userDto;
  const existingUser = await getUserByEmail(email);
  if (existingUser) return { errors: { email: 'Email already exists' } };

  // Create a new user
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: { create: { hash: hash('sha256', password) } },
      },
    });

    const authSession = await getSession(request);
    authSession.set('user', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

    return redirect(redirectUrl, {
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
    },
  });

  if (!user) {
    return { errors: { email: LOGIN_ERR_MSG } };
  }

  const authSession = await getSession(request);
  authSession.set('user', {
    id: user.id,
    name: user.name,
    email: user.email,
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
