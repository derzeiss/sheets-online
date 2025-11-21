import { Form, href, Link } from 'react-router';
import { Button } from '~/components/Button';
import { ErrorMessage } from '~/components/ErrorMessage';
import { Textbox } from '~/components/Textbox';
import { registerFormSchema, type UserRegisterDto } from '~/domain/auth/register.schema';
import { register } from '~/domain/auth/user.server';
import { useFormBucket } from '~/domain/form/useFormBucket';
import { formatZodError } from '~/domain/utils/formatZodError';
import type { Route } from './+types/register';

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const parseResult = registerFormSchema.safeParse(values);
  if (!parseResult.success) return { errors: formatZodError(parseResult.error) };
  return await register(request, parseResult.data);
};

export default function RegisterRoute({ actionData }: Route.ComponentProps) {
  const { formData, register, errorFor } = useFormBucket<UserRegisterDto>({
    initialData: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    schema: registerFormSchema,
  });

  return (
    <main className="content my-16 max-w-md rounded-lg border border-neutral-200 bg-white py-10">
      <h1 className="mb-4 text-5xl">Register</h1>

      <Form method="post">
        <Textbox className="mt-3" type="text" placeholder="Name" required {...register('name')} />
        {errorFor('name', (msg) => (
          <ErrorMessage className="mt-1">{msg}</ErrorMessage>
        ))}

        <Textbox
          className="mt-3"
          type="email"
          placeholder="E-Mail"
          required
          {...register('email')}
        />
        {errorFor('email', (msg) => (
          <ErrorMessage className="mt-1">{msg}</ErrorMessage>
        ))}

        <Textbox
          className="mt-3"
          type="password"
          placeholder="Password"
          required
          {...register('password')}
        />
        {errorFor('password', (msg) => (
          <ErrorMessage className="mt-1">{msg}</ErrorMessage>
        ))}

        <Textbox
          className="mt-3"
          type="password"
          placeholder="Repeat Password"
          required
          {...register('confirmPassword')}
        />
        {errorFor('confirmPassword', (msg) => (
          <ErrorMessage className="mt-1">{msg}</ErrorMessage>
        ))}

        <Button className="mt-3" type="submit">
          Register
        </Button>
        <Link to={href('/auth/login')} className="inline-link mt-4 block text-sm text-neutral-600">
          Already have an Account?
        </Link>
      </Form>
    </main>
  );
}
