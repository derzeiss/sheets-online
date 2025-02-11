import type { ComponentProps, FC } from 'react';
import { cx } from '~/utils/cx';

export interface ButtonProps extends ComponentProps<'button'> {}

export const Button: FC<ButtonProps> = (props) => {
  return <button {...props} className={cx(props.className, 'btn')} />;
};
