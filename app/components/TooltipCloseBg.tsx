import clsx from 'clsx';
import type { FC } from 'react';

interface Props {
  visible: boolean;
  onClick: () => void;
}

export const TooltipCloseBg: FC<Props> = ({ visible, onClick }) => {
  return (
    <div
      className={clsx('fixed inset-0', {
        hidden: !visible,
        visible: visible,
      })}
      onClick={onClick}
    />
  );
};
