import type { FC } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cx } from '~/domain/utils/cx';

export interface Props extends LinkProps {
  tertiary?: boolean;
}

export const ButtonLink: FC<Props> = ({ tertiary, className, ...props }) => {
  return (
    <Link
      {...props}
      className={cx(className, 'btn', {
        'bg-transparent': !!tertiary,
      })}
    />
  );
};
