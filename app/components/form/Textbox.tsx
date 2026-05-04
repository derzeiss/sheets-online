import clsx from 'clsx';
import type { ComponentProps, FC } from 'react';

export interface TextboxProps extends ComponentProps<'input'> {}

// also used for textarea
export const TEXTBOX_CLS = clsx(
  'block w-full rounded-3xl px-4 py-4 inset-ring inset-ring-neutral-300 transition-shadow outline-none focus:inset-ring-2 focus:inset-ring-yellow-400',
);

export const Textbox: FC<TextboxProps> = (props) => {
  return <input {...props} className={clsx(props.className, TEXTBOX_CLS)} />;
};
