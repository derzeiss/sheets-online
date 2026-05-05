import { MusicNoteIcon } from '@proicons/react';
import clsx from 'clsx';
import { useRef, useState, type FC } from 'react';
import type { Note } from '~/domain/chordpro-parser/types/Note';
import { Button } from './button/Button';
import { KeyKeyboard } from './KeyKeyboard';

interface Props {
  className?: string;
  selectedKey: Note;
  onKeySelect: (key: Note) => void;
  closeOnSelect?: boolean;
}

export const KeySelectButton: FC<Props> = ({
  className,
  selectedKey,
  onKeySelect,
  closeOnSelect,
}) => {
  const [keyListOpen, setKeyListOpen] = useState(false);
  const $container = useRef<HTMLDivElement>(null);

  const handleKeySelect = (note: Note) => {
    if (closeOnSelect) setKeyListOpen(false);
    onKeySelect(note);
  };

  const toggleKeyListOpen = (newState?: boolean) => {
    if (newState === undefined) newState = !keyListOpen;

    if (newState && $container.current) {
      const clientWidth = document.body.clientWidth;
      const { left, width } = $container.current.getBoundingClientRect();
      const overlapRight = left + width - clientWidth;
      if (overlapRight > 0) {
        $container.current.style.left = overlapRight * -1 - 16 + 'px';
      }
    }

    setKeyListOpen(newState);
  };

  return (
    <div className={clsx('relative flex w-fit', className)}>
      <div
        className={clsx('fixed inset-0', {
          hidden: !keyListOpen,
          visible: keyListOpen,
        })}
        onClick={() => toggleKeyListOpen(false)}
      />
      <KeyKeyboard
        ref={$container}
        selectedKey={selectedKey}
        onKeySelect={(note) => handleKeySelect(note)}
        className={clsx(
          'absolute top-[calc(100%+0.5rem)] left-0 z-10 rounded-3xl border border-neutral-200 bg-white p-2 shadow-lg transition-all dark:border-neutral-700 dark:bg-neutral-900',
          {
            'invisible -translate-y-2 opacity-0': !keyListOpen,
            'visible translate-y-0 opacity-100': keyListOpen,
          },
        )}
      />

      <Button type="button" size="sm" onClick={() => toggleKeyListOpen()}>
        <MusicNoteIcon size={20} /> {selectedKey}
      </Button>
    </div>
  );
};
