export interface FormBucket<T extends object> {
  values: T;
  errors: { [key in keyof T]?: string } | null;
  touched: { [key in keyof T]?: boolean };
  isSubmitting: boolean;
  isValid: boolean;
}
