import {
  AppsListIcon,
  MusicNote2Icon,
  PowerIcon,
  SettingsIcon,
} from '@proicons/react';
import { type FC } from 'react';
import { href } from 'react-router';
import type { SessionUser } from '~/domain/auth/types/SessionUser';
import { TabNavBtn } from './TabNavBtn';
import { ThemeToggleBtn } from './ThemeToggleBtn';

interface TopNavProps {
  me: SessionUser | null;
}

export const TopNav: FC<TopNavProps> = ({ me }) => {
  let url: string, label: React.ReactNode;
  if (!me) {
    // shouldn't happen bc of middleware
    url = href('/auth/login');
    label = 'Login';
  } else if (me.role === 'admin') {
    url = href('/settings');
    label = (
      <>
        <SettingsIcon size={20} />
      </>
    );
  } else {
    url = href('/auth/logout');
    label = (
      <>
        <PowerIcon size={20} />
      </>
    );
  }

  return (
    <nav className="flex w-full items-center justify-center">
      <TabNavBtn to={href('/setlists')}>
        <AppsListIcon size={20} />
        <span>Sets</span>
      </TabNavBtn>
      <TabNavBtn to={href('/songs')}>
        <MusicNote2Icon size={20} />
        Songs
      </TabNavBtn>

      <div className="absolute top-0 right-0 flex h-0 w-full items-start justify-end gap-1">
        <ThemeToggleBtn className="absolute top-0 left-1 sm:static" />
        <TabNavBtn to={url}>{label}</TabNavBtn>
      </div>
    </nav>
  );
};
