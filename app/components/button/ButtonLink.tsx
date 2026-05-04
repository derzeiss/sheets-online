import type { FC } from 'react';
import { Link, type LinkProps } from 'react-router';
import { getButtonCls, type BtnProps } from './getButtonCls';

interface ButtonLinkProps extends LinkProps, BtnProps {}

export const ButtonLink: FC<ButtonLinkProps> = ({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <Link {...props} className={getButtonCls({ variant, size, className })} />
  );
};
