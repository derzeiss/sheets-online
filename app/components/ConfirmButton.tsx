import { useState, type ComponentProps, type FC, type MouseEvent, type ReactNode } from 'react';
import { cx } from '~/utils/cx';

interface Props extends ComponentProps<'button'> {
  childrenConfirm?: ReactNode;
}

export const ConfirmButton: FC<Props> = ({
  className,
  children,
  childrenConfirm = 'You sure?',
  onClick,
  ...props
}) => {
  const [confirming, setConfirming] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleFirstClick = () => {
    setTimeout(() => setConfirming(true));

    setTimer(
      setTimeout(() => {
        setConfirming(false);
        setTimer(null);
      }, 3000),
    );
  };

  const handleSecondClick = (ev: MouseEvent<HTMLButtonElement>) => {
    if (timer) clearTimeout(timer);
    setTimeout(() => setConfirming(false));
    setTimer(null);
    onClick && onClick(ev);
  };

  if (!confirming) {
    return (
      <button {...props} className={cx(className, 'btn')} onClick={handleFirstClick} type="button">
        {children}
      </button>
    );
  }

  return (
    <button {...props} className={cx(className, 'btn')} onClick={handleSecondClick}>
      {childrenConfirm}
    </button>
  );
};
