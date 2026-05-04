import type { ComponentProps, FC } from 'react';
import { getButtonCls, type BtnProps } from './getButtonCls';

interface ButtonProps extends ComponentProps<'button'>, BtnProps {}

export const Button: FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <button {...props} className={getButtonCls({ variant, size, className })} />
  );
};
