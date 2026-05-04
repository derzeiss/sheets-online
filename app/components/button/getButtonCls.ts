import clsx from 'clsx';

export type BtnVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type BtnSize = 'sm' | 'sm_icon' | 'md' | 'lg';

export interface BtnProps {
  className?: string;
  variant?: BtnVariant;
  size?: BtnSize;
}

export const getButtonCls = ({
  className,
  variant = 'secondary',
  size = 'md',
}: BtnProps) =>
  clsx(
    className,
    'flex w-fit cursor-pointer items-center justify-center rounded-full font-semibold tracking-wide uppercase transition-colors select-none active:transition-none',
    {
      // TODO: btn-primary-states
      'bg-yellow-300 text-neutral-900': variant === 'primary',
      'bg-white inset-ring inset-ring-neutral-200 hover:bg-neutral-100 active:bg-neutral-200':
        variant === 'secondary',
      'hover:bg-neutral-100 active:bg-neutral-200': variant === 'tertiary',
      'bg-red-100 text-red-600': variant === 'danger',

      'gap-4 px-7 py-4 text-sm': size === 'lg',
      'gap-3 px-7 py-3 text-sm': size === 'md',
      'gap-2 px-4 py-3 text-xs': size === 'sm',
      'gap-2 px-3 py-3 text-xs': size === 'sm_icon',
    },
  );
