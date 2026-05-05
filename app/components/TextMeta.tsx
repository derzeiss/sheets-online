import clsx from 'clsx';
import type { ComponentProps, FC } from 'react';

export const TextMeta: FC<ComponentProps<'div'>> = (props) => (
  <div
    {...props}
    className={clsx(
      props.className,
      'text-sm text-neutral-500 dark:text-neutral-400',
    )}
  />
);
