import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
} from 'react';
import type { z } from 'zod';
import { formatZodError } from '../utils/formatZodError';
import type { FormBucket } from './FormBucket';

interface UseFormBucketProps<T> {
  initialData: T;
  schema: z.ZodType<T>;
}

export const useFormBucket = <T extends object>({
  initialData,
  schema,
}: UseFormBucketProps<T>) => {
  const [formData, setFormData] = useState<FormBucket<T>>({
    values: initialData,
    errors: null,
    touched: {},
    isSubmitting: false,
    isValid: false,
  });

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const newValues = { ...formData.values, [ev.target.name]: ev.target.value };
    const validationResult = schema.safeParse(newValues);
    let newErrors = validationResult.success
      ? null
      : formatZodError(validationResult.error);
    setFormData({ ...formData, values: newValues, errors: newErrors });
  };

  const onBlur = (ev: FocusEvent<HTMLInputElement>) => {
    const name = ev.target.name;
    if (formData.touched[name as keyof T]) return;
    const validationResult = schema.safeParse(formData.values);
    let newErrors = validationResult.success
      ? null
      : formatZodError(validationResult.error);

    setFormData({
      ...formData,
      errors: newErrors,
      touched: { ...formData.touched, [ev.target.name]: true },
    });
  };

  const register = (name: keyof T) => {
    return {
      name,
      value: formData.values[name],
      onChange,
      onBlur,
    };
  };

  const errorFor = (name: keyof T, renderErr: (msg: string) => ReactNode) => {
    if (formData.touched[name] && formData.errors && formData.errors[name]) {
      return renderErr(formData.errors[name]);
    }
  };

  return {
    formData,
    register,
    errorFor,
  };
};
