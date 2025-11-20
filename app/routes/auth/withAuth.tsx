import { requireUser } from '~/domain/auth/authMiddleware.server';
import type { Route } from './+types/withAuth';

export const middleware: Route.MiddlewareFunction[] = [requireUser];

// empty loader so the middleware runs on every navigation, even pure client-side
export const loader = () => null;
