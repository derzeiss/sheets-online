import { ArrowRightIcon } from '@proicons/react';
import { Form, href, Link, redirect } from 'react-router';
import { Button } from '~/components/button/Button';
import { ButtonLink } from '~/components/button/ButtonLink';
import { ErrorMsg } from '~/components/form/ErrorMsg';
import { Textbox } from '~/components/form/Textbox';
import { userContext } from '~/domain/auth/authMiddleware.server';
import { loginFormSchema } from '~/domain/auth/login.schema';
import { login } from '~/domain/auth/user.server';
import { formatZodError } from '~/domain/utils/formatZodError';
import { getQueryParam } from '~/domain/utils/getQueryParam';
import type { Route } from './+types/login';

export const loader = ({ context }: Route.LoaderArgs) => {
  const me = context.get(userContext);
  if (me) return redirect(href('/setlists'));
};

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
    <main className="content my-16 max-w-md rounded-3xl border border-neutral-200 bg-white py-10">
      <h1 className="h1">Login</h1>

      <Form method="post" className="mt-8 space-y-4">
        <Textbox name="email" type="email" placeholder="E-Mail" required />
        <Textbox
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        {/* Show server errors */}
        {actionData?.errors && (
          <ErrorMsg>{Object.values(actionData.errors).join('\n')}</ErrorMsg>
        )}

        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            Login
            <ArrowRightIcon size={20} />
          </Button>
          <ButtonLink
            to={href('/auth/register')}
            variant="tertiary"
            type="submit"
          >
            Sign up
          </ButtonLink>
        </div>
        <Link
          to={href('/auth/forgot-password')}
          className="inline-link mt-8 block text-sm text-neutral-600"
        >
          Forgot your password?
        </Link>
      </Form>
    </main>
  );
}
