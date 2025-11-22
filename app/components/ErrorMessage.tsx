import type { ComponentProps, FC } from 'react';
import { cx } from '~/domain/utils/cx';

export interface ErrorMessageProps extends ComponentProps<'div'> {}

export const ErrorMessage: FC<ErrorMessageProps> = (props) => {
  return (
    <div
      {...props}
      className={cx(
        props.className,
        'rounded bg-red-200 px-3 py-2 text-red-900',
      )}
    />
  );
};
