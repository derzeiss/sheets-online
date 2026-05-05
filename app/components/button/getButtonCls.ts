import clsx from 'clsx';

export type BtnVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'selected';
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
      'bg-primary-300 dark:bg-primary-300/40': variant === 'primary',
      'bg-white inset-ring inset-ring-neutral-200 dark:bg-neutral-900 dark:inset-ring-neutral-700':
        variant === 'secondary',
      'hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700':
        variant === 'secondary' || variant === 'tertiary',
      'bg-red-100 text-red-600 dark:bg-red-400/10 dark:text-red-400':
        variant === 'danger',
      'bg-primary-50 dark:bg-primary-50/10 dark:inset-ring-primary-400/50 inset-ring-primary-400 inset-ring':
        variant === 'selected',

      // 'gap-4 px-6 py-4 text-sm': size === 'lg',
      'gap-3 px-6 py-3 text-sm': size === 'md',
      'gap-2 px-4 py-3 text-xs': size === 'sm',
      'gap-2 px-3 py-3 text-xs': size === 'sm_icon',
    },
  );
