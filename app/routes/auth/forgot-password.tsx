import { Form, Link, href } from 'react-router';
import { Button } from '~/components/Button';
import { Textbox } from '~/components/Textbox';

export const action = () => {
  // TODO:
  throw new Error('Not implemented');
};

export default function ForgotPasswordRoute() {
  return (
    <main className="content my-16 max-w-md rounded-lg border border-neutral-200 py-10">
      <h1 className="mb-4 text-5xl">Forgot password</h1>

      <Form method="post">
        <Textbox placeholder="Enter your email" name="email" type="text" />
        <Button className="mt-3">Send password reset email</Button>
      </Form>

      <Link to={href('/auth/login')} className="inline-link mt-4 block text-sm text-neutral-600">
        Back to login
      </Link>
    </main>
  );
}
