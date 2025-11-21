import { href, NavLink, Outlet } from 'react-router';

// export const middleware: Route.MiddlewareFunction[] = [requireRole('admin')];

export const loader = () => null;

export default function () {
  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">Settings</h1>
      <nav className="mb-4 flex w-full">
        <NavLink
          to={href('/settings')}
          className="clickable block px-4 py-3 text-center text-sm"
          end
        >
          General
        </NavLink>
        <NavLink
          to={href('/settings/user-admin')}
          className="clickable block px-4 py-3 text-center text-sm"
          end
        >
          User-Admin
        </NavLink>
      </nav>
      <Outlet />
    </main>
  );
}
