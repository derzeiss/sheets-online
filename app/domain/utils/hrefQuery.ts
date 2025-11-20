import { href } from 'react-router';

type HrefParams = Parameters<typeof href>;

type HrefQueryOptions = {
  args?: HrefParams[1];
  query?: Record<string, string>;
};

export const hrefQuery = (url: HrefParams[0], options?: HrefQueryOptions) => {
  const urlSafe = href(url, options?.args as any);
  if (!options?.query) return urlSafe;

  return (
    urlSafe +
    '?' +
    Object.entries(options.query)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')
  );
};
