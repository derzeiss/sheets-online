import { Form, Link, href } from 'react-router';
import { Button } from '~/components/button/Button';
import { Textbox } from '~/components/form/Textbox';

export const action = () => {
  // TODO:
  throw new Error('Not implemented');
};

export default function ForgotPasswordRoute() {
  return (
    <main className="content my-16 max-w-md rounded-lg border border-neutral-200 py-10">
      <h1 className="h1">Forgot password</h1>

      <Form method="post" className="mt-8 space-y-4">
        <Textbox placeholder="Enter your email" name="email" type="text" />
        <Button variant="primary">Send password reset email</Button>
      </Form>

      <Link
        to={href('/auth/login')}
        className="inline-link mt-8 block text-sm text-neutral-600"
      >
        Back to login
      </Link>
    </main>
  );
}
