import type { ComponentProps, FC } from 'react';
import { cx } from '~/utils/cx';

export const Button: FC<ComponentProps<'button'>> = (props) => {
  return <button {...props} className={cx(props.className, 'btn')} />;
};
