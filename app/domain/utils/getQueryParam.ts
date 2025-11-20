export const getQueryParam = (request: Request, paramName: string) => {
  const url = new URL(request.url);
  const urlParams = new URLSearchParams(url.search);
  return urlParams.get(paramName);
};
