export type ErrorsFor<T> = { errors: { [key in keyof T | '_form']?: string } };
