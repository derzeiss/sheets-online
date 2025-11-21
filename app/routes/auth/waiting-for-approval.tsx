import { href, Link } from 'react-router';

export default function () {
  return (
    <main className="content my-10 max-w-3xl">
      <h1 className="mb-4 text-5xl">Waiting for approval</h1>
      <p className="mt-4">
        You successfully created your account, but it needs to be manually approved by an admin.
        Please wait until that happens or contact your system admin.
      </p>
      <p className="mt-4">
        If you've been activated, try{' '}
        <Link className="underline" to={href('/auth/login')}>
          logging in
        </Link>{' '}
        again.
      </p>
    </main>
  );
}
