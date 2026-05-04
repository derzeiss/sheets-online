import clsx from 'clsx';
import type { ComponentProps, FC } from 'react';

export interface ErrorMessageProps extends ComponentProps<'div'> {}

export const ErrorMsg: FC<ErrorMessageProps> = (props) => {
  return (
    <div
      {...props}
      className={clsx(
        props.className,
        'rounded-3xl bg-red-100 p-4 text-red-700',
      )}
    />
  );
};
