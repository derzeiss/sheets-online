export const COOKIE_SECRET = process.env.COOKIE_SECRET || 'default-secret';
if (COOKIE_SECRET === 'default-secret') {
  console.warn('No COOKIE_SECRET set, the app is insecure!');
}
