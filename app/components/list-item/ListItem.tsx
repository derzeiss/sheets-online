import clsx from 'clsx';
import type { ComponentProps, FC } from 'react';

export const ListItem: FC<ComponentProps<'li'>> = (props) => (
  <li
    {...props}
    className={clsx(
      props.className,
      'relative flex justify-between border-t border-t-neutral-200 p-2 text-left',
    )}
  />
);
