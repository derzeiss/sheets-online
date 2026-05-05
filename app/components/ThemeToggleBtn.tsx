import { LightbulbIcon, MoonIcon } from '@proicons/react';
import { useState, type FC } from 'react';
import { Button } from './button/Button';
import type { BtnProps } from './button/getButtonCls';

export const ThemeToggleBtn: FC<BtnProps> = (props) => {
  const theme = getTheme();
  const [, setUpdate] = useState(Math.random());

  const handleThemeSwitch = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = theme === 'dark' ? 'light' : 'dark';
    setUpdate(Math.random());
  };

  return (
    <Button
      {...props}
      variant="tertiary"
      size="sm_icon"
      onClick={handleThemeSwitch}
    >
      {theme === 'light' && <LightbulbIcon size={20} />}
      {theme === 'dark' && <MoonIcon size={20} />}
    </Button>
  );
};

const getTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';
};
