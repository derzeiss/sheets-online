import { z, type ZodError } from 'zod';

type FormValidationError<T extends object> = {
  [field in keyof T | '_form']?: string;
};

export const formatZodError = <T extends object>(err: ZodError<T>) => {
  const flat = z.flattenError(err);
  const formatted: FormValidationError<T> = {};
  if (flat.formErrors && flat.formErrors.length) formatted._form = flat.formErrors.join('\n');
  Object.keys(flat.fieldErrors).forEach((field) => {
    const _f = field as keyof T;
    const errs = flat.fieldErrors[_f];
    if (!errs) return;
    formatted[_f] = errs.join('\n');
  });
  return formatted;
};
