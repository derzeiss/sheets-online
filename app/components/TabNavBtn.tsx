import clsx from 'clsx';
import type { FC } from 'react';
import { type LinkProps, NavLink } from 'react-router';

export const TabNavBtn: FC<LinkProps> = (props) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      clsx(props.className, 'flex gap-2 border-b-2 px-4 py-3 text-sm', {
        'border-b-transparent': !isActive,
        'border-b-primary-400 bg-primary-50 dark:border-b-primary-400/50 dark:bg-primary-50/10 font-semibold':
          isActive,
      })
    }
  />
);
