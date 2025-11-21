import { href, Link } from 'react-router';

export default function () {
  // TODO: style this nicer, give routeError info
  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">404 — Not found</h1>
      <p className="mt-4">The URL you entered couldn't be found... :(</p>
      <p className="mt-4">
        <Link className="underline" to={href('/')}>
          Go back to the Start Page
        </Link>{' '}
      </p>
    </main>
  );
}
