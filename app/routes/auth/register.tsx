import { ArrowRightIcon } from '@proicons/react';
import { Form, href, Link } from 'react-router';
import { Button } from '~/components/button/Button';
import { ErrorMsg } from '~/components/form/ErrorMsg';
import { Textbox } from '~/components/form/Textbox';
import {
  registerFormSchema,
  type UserRegisterDto,
} from '~/domain/auth/register.schema';
import { register } from '~/domain/auth/user.server';
import { useFormBucket } from '~/domain/form/useFormBucket';
import { formatZodError } from '~/domain/utils/formatZodError';
import type { Route } from './+types/register';

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const parseResult = registerFormSchema.safeParse(values);
  if (!parseResult.success) {
    return { errors: formatZodError(parseResult.error) };
  }
  return await register(request, parseResult.data);
};

export default function RegisterRoute() {
  const { register, errorFor } = useFormBucket<UserRegisterDto>({
    initialData: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    schema: registerFormSchema,
  });

  const errMsgFor = (field: keyof UserRegisterDto) =>
    errorFor(field, (msg) => <ErrorMsg className="-mt-2">{msg}</ErrorMsg>);

  return (
    <main className="content my-16 max-w-md rounded-lg border border-neutral-200 bg-white py-10">
      <h1 className="h1">Register</h1>

      <Form method="post" className="mt-8 space-y-4">
        <Textbox
          type="text"
          placeholder="Name"
          required
          {...register('name')}
        />
        {errMsgFor('name')}

        <Textbox
          type="email"
          placeholder="E-Mail"
          required
          {...register('email')}
        />
        {errMsgFor('email')}

        <Textbox
          type="password"
          placeholder="Password"
          required
          {...register('password')}
        />
        {errMsgFor('password')}

        <Textbox
          type="password"
          placeholder="Repeat Password"
          required
          {...register('confirmPassword')}
        />
        {errMsgFor('confirmPassword')}

        <Button type="submit" variant="primary">
          Register
          <ArrowRightIcon size={20} />
        </Button>
        <Link
          to={href('/auth/login')}
          className="inline-link mt-4 block text-sm text-neutral-600"
        >
          Already have an Account?
        </Link>
      </Form>
    </main>
  );
}
