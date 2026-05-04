import { href, Outlet } from 'react-router';
import { TabNavBtn } from '~/components/TabNavBtn';
import { requireRole } from '~/domain/auth/authMiddleware.server';
import type { Route } from './+types/layout';

export const middleware: Route.MiddlewareFunction[] = [requireRole('admin')];

export const loader = () => null;

export default function SettingsRoute() {
  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="h1 mb-4">Settings</h1>
      <nav className="mb-4 flex w-full">
        <TabNavBtn to={href('/settings/general')}>General</TabNavBtn>
        <TabNavBtn to={href('/settings/user-admin')}>User-Admin</TabNavBtn>
      </nav>
      <Outlet />
    </main>
  );
}
