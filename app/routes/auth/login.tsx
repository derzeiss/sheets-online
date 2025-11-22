import { Form, href, Link } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { ErrorMessage } from '~/components/ErrorMessage';
import { Textbox } from '~/components/Textbox';
import { loginFormSchema } from '~/domain/auth/login.schema';
import { login } from '~/domain/auth/user.server';
import { formatZodError } from '~/domain/utils/formatZodError';
import { getQueryParam } from '~/domain/utils/getQueryParam';
import type { Route } from './+types/login';

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const parseResult = loginFormSchema.safeParse(values);
  if (!parseResult.success) {
    return { errors: formatZodError(parseResult.error) };
  }
  return await login(
    request,
    parseResult.data,
    getQueryParam(request, 'redirect') || '/setlists',
  );
};

export default function LoginRoute({ actionData }: Route.ComponentProps) {
  return (
    <main className="content my-16 max-w-md rounded-lg border border-neutral-200 bg-white py-10">
      <h1 className="mb-4 text-5xl">Login</h1>

      <Form method="post">
        <Textbox
          className="mt-3"
          name="email"
          type="email"
          placeholder="E-Mail"
          required
        />
        <Textbox
          className="mt-3"
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        {/* Show server errors */}
        {actionData?.errors && (
          <ErrorMessage className="mt-3">
            {Object.values(actionData.errors).join('\n')}
          </ErrorMessage>
        )}

        <Button className="mt-3" type="submit">
          Login
        </Button>
        <ButtonLink
          to={href('/auth/register')}
          tertiary
          className="mt-3 ml-3"
          type="submit"
        >
          Sign up
        </ButtonLink>
        <Link
          to={href('/auth/forgot-password')}
          className="inline-link mt-4 block text-sm text-neutral-600"
        >
          Forgot your password?
        </Link>
      </Form>
    </main>
  );
}
