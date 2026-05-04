import { QuestionIcon } from '@proicons/react';
import clsx from 'clsx';
import { useState, type ComponentProps, type FC, type ReactNode } from 'react';
import { Button } from './Button';
import type { BtnProps } from './getButtonCls';

interface DoubleConfirmBtnProps extends ComponentProps<'button'>, BtnProps {
  childrenConfirming?: ReactNode;
}

export const DoubleConfirmBtn: FC<DoubleConfirmBtnProps> = ({
  onClick,
  childrenConfirming = (
    <>
      <QuestionIcon size={20} />
      You sure??
    </>
  ),
  ...props
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeout, _setTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleFirstClick = () => {
    if (timeout) clearTimeout(timeout);
    _setTimeout(setTimeout(() => setShowConfirm(false), 3000));
    setTimeout(() => setShowConfirm(true));
  };

  const handleSecondClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (timeout) clearTimeout(timeout);
    setTimeout(() => setShowConfirm(false));
    _setTimeout(null);
    if (onClick) onClick(ev);
  };

  if (!showConfirm) {
    return <Button {...props} onClick={handleFirstClick} type="button" />;
  }
  return (
    <Button
      {...props}
      onClick={handleSecondClick}
      variant="danger"
      className={clsx(props.className, 'inset-ring-2 inset-ring-red-600')}
      children={childrenConfirming}
    />
  );
};
