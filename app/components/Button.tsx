import type { ComponentProps, FC } from 'react';
import { cx } from '~/domain/utils/cx';

export interface ButtonProps extends ComponentProps<'button'> {
  tertiary?: boolean;
}

export const Button: FC<ButtonProps> = ({ tertiary, className, ...props }) => {
  return (
    <button
      {...props}
      className={cx(className, 'btn', {
        'bg-transparent': !!tertiary,
      })}
    />
  );
};
