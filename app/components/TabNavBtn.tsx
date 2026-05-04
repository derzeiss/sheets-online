import clsx from 'clsx';
import type { FC } from 'react';
import { type LinkProps, NavLink } from 'react-router';

export const TabNavBtn: FC<LinkProps> = (props) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      clsx(
        props.className,
        'flex gap-2 border-b-2 border-b-transparent px-4 py-3 text-sm',
        {
          'border-b-yellow-400 bg-yellow-50 font-semibold': isActive,
        },
      )
    }
  />
);
