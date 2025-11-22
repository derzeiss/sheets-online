import { prisma } from '~/domain/prisma';
import type { Route } from './+types/user-admin';
import { userContext } from '~/domain/auth/authMiddleware.server';
import { useLoaderData, Form, useSubmit, data } from 'react-router';
import type { UserRole } from '@prisma/client';

const ACTION_TOGGLE_USER_ACTIVE = 'toggleUserActive';
const ACTION_SET_USER_ROLE = 'setUserRole';

export async function loader({ context }: Route.LoaderArgs) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
    take: 50,
  });

  const me = context.get(userContext);

  return { me, users };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (!values.id || typeof values.id !== 'string') {
    throw data('No user id given.', { status: 400 });
  }

  switch (values._action) {
    case ACTION_SET_USER_ROLE:
      return await prisma.user.update({
        where: { id: values.id },
        data: { role: values.role as UserRole },
      });
    case ACTION_TOGGLE_USER_ACTIVE:
      return await prisma.user.update({
        where: { id: values.id },
        data: { isActive: values.isActive === 'true' },
      });
  }
}

export default function () {
  const submit = useSubmit();
  const { me, users } = useLoaderData<typeof loader>();

  return (
    <section className="my-8">
      <h2 className="text-2xl">Inactive Users</h2>
      <table className="mt-4 w-full">
        <thead>
          <tr className="bg-neutral-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">E-Mail</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">IsActive</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="even:bg-neutral-50">
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">
                <Form method="post">
                  <input
                    name="_action"
                    value={ACTION_SET_USER_ROLE}
                    type="hidden"
                  />
                  <input name="id" value={u.id} type="hidden" />
                  <select
                    name="role"
                    defaultValue={u.role}
                    onChange={(ev) =>
                      submit(ev.target.parentElement as HTMLFormElement)
                    }
                  >
                    <option value="default">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </Form>
              </td>
              <td>
                <Form method="post">
                  <input
                    name="_action"
                    value={ACTION_TOGGLE_USER_ACTIVE}
                    type="hidden"
                  />
                  <input name="id" value={u.id} type="hidden" />
                  <input
                    name="isActive"
                    value={!u.isActive + ''}
                    type="hidden"
                  />
                  <button className="btn" type="submit">
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
