import { logout } from '~/domain/auth/user.server';
import type { Route } from './+types/logout';

export const action = ({ request }: Route.ActionArgs) => logout(request);
export const loader = ({ request }: Route.LoaderArgs) => logout(request);
