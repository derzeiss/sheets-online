import type { FC } from 'react';
import { cx } from '~/domain/utils/cx';

interface Props {
  visible: boolean;
  onClick: () => void;
}

export const TooltipCloseBg: FC<Props> = ({ visible, onClick }) => {
  return (
    <div
      className={cx('fixed inset-0', {
        hidden: !visible,
        visible: visible,
      })}
      onClick={onClick}
    />
  );
};
