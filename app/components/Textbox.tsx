import type { ComponentProps, FC } from 'react';
import { cx } from '~/domain/utils/cx';

interface Props extends ComponentProps<'input'> {}

export const Textbox: FC<Props> = (props) => {
  return (
    <input
      {...props}
      className={cx(
        'mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 leading-relaxed',
        props.className,
      )}
    />
  );
};
