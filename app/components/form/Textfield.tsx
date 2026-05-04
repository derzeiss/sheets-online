import clsx from 'clsx';
import type { FC } from 'react';
import { FieldLabel } from './FieldLabel';
import { Textbox, type TextboxProps } from './Textbox';

interface TextfieldProps extends TextboxProps {
  label: string;
}

export const Textfield: FC<TextfieldProps> = ({
  label,
  className,
  children,
  ...props
}) => {
  return (
    <label className={clsx(className, 'block')}>
      <FieldLabel className="mb-2">{label}</FieldLabel>
      <Textbox {...props} />
      {children && <p className="mt-2 text-sm text-neutral-500">{children}</p>}
    </label>
  );
};
