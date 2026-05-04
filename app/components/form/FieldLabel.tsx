import clsx from 'clsx';
import type { ComponentProps, FC } from 'react';

export const FieldLabel: FC<ComponentProps<'span'>> = (props) => (
  <span
    {...props}
    className={clsx(props.className, 'block text-sm font-semibold')}
  />
);
