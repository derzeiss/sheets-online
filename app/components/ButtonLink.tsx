import type { FC } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cx } from '~/domain/utils/cx';

export const ButtonLink: FC<LinkProps> = (props) => {
  return <Link {...props} className={cx(props.className, 'btn')} />;
};
