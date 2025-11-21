import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),

  ...prefix('auth', [
    route('login', 'routes/auth/login.tsx'),
    route('logout', 'routes/auth/logout.tsx'),
    route('register', 'routes/auth/register.tsx'),
    route('forgot-password', 'routes/auth/forgot-password.tsx'),
    route('waiting-for-approval', 'routes/auth/waiting-for-approval.tsx'),
  ]),

  layout('routes/auth/withAuth.tsx', [
    ...prefix('setlists', [
      index('routes/setlists/index.tsx'),
      route(':id', 'routes/setlists/$id.tsx'),
      route(':id/edit', 'routes/setlists/$id.edit.tsx'),
      route(':id/play', 'routes/setlists/$id.play.tsx'),
    ]),

    ...prefix('songs', [
      index('routes/songs/index.tsx'),
      route(':id', 'routes/songs/$id.tsx'),
      route(':id/edit', 'routes/songs/$id.edit.tsx'),
    ]),

    route('settings', 'routes/settings/layout.tsx', [
      index('routes/settings/index.tsx'),
      route('user-admin', 'routes/settings/user-admin.tsx'),
      route('download-song-lib', 'routes/settings/download-song-lib.tsx'),
    ]),
  ]),

  route('*', 'routes/404.tsx'),
] satisfies RouteConfig;
