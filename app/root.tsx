import {
  href,
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';
import type { Route } from './+types/root';
import stylesheet from './app.css?url';
import {
  userContext,
  useUserSessionMiddleware,
} from './domain/auth/authMiddleware.server';

export const middleware: Route.MiddlewareFunction[] = [
  useUserSessionMiddleware,
];
export const links: Route.LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'sheets-online' },
    {
      name: 'description',
      content: 'Manage and use your Worship Song-Sheets online',
    },
  ];
}

export const loader = ({ context }: Route.LoaderArgs) => {
  const me = context.get(userContext);
  return me;
};

export default function App() {
  const me = useLoaderData<typeof loader>();

  let url: string, label: string;
  if (!me) {
    url = href('/auth/login');
    label = 'Login';
  } else if (me.role === 'admin') {
    url = href('/settings');
    label = 'Settings';
  } else {
    url = href('/auth/logout');
    label = 'Logout';
  }

  return (
    <>
      <nav className="flex w-full justify-center">
        <NavLink
          to="/setlists"
          className="clickable block px-4 py-3 text-center text-sm"
        >
          Sets
        </NavLink>
        <NavLink
          to="/songs"
          className="clickable block px-4 py-3 text-center text-sm"
        >
          Songs
        </NavLink>
        <NavLink
          to={url}
          className="clickable absolute top-0 right-0 block px-4 py-3 text-center text-sm"
        >
          {label}
        </NavLink>
      </nav>
      <Outlet />
      <footer className="fixed right-2 bottom-2 flex w-full justify-end gap-2 text-xs text-neutral-500">
        <a className="inline-link" href="https://alexzeiss.de/impressum">
          Impressum
        </a>
        <a className="inline-link" href="https://alexzeiss.de/datenschutz">
          Datenschutz
        </a>
      </footer>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="content mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
