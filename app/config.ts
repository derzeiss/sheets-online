export const COOKIE_SECRET = process.env.COOKIE_SECRET || 'default-secret';
if (COOKIE_SECRET === 'default-secret') {
  console.warn('No COOKIE_SECRET set, the app is insecure!');
}

export const SYS_ADMIN_EMAIL = process.env.SYS_ADMIN_EMAIL || null;
