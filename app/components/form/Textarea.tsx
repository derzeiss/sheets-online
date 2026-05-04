import clsx from 'clsx';
import type { ComponentProps, FC } from 'react';
import { FieldLabel } from './FieldLabel';
import { TEXTBOX_CLS } from './Textbox';

interface TextareaProps extends ComponentProps<'textarea'> {
  label?: string;
}
export const Textarea: FC<TextareaProps> = ({
  label,
  className,
  children,
  ...props
}) => {
  return (
    <label className={clsx(className, 'flex flex-col')}>
      {label && <FieldLabel className="mb-2">{label}</FieldLabel>}
      <textarea {...props} className={clsx(TEXTBOX_CLS, 'grow')} />
      {children && <p className="mt-2 text-sm text-stone-500">{children}</p>}
    </label>
  );
};
