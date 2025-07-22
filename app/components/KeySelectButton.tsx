import { useEffect, useRef, useState, type FC } from 'react';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import { cx } from '~/utils/cx';
import { Button } from './Button';
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

  useEffect(() => {}, [$container.current]);

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
    <div className={cx('relative flex w-fit', className)}>
      <div
        className={cx('fixed inset-0', {
          hidden: !keyListOpen,
          visible: keyListOpen,
        })}
        onClick={() => toggleKeyListOpen(false)}
      />
      <KeyKeyboard
        ref={$container}
        selectedKey={selectedKey}
        onKeySelect={(note) => handleKeySelect(note)}
        className={cx(
          'absolute top-[calc(100%+0.5rem)] left-0 z-10 rounded-sm border border-neutral-200 bg-white p-2 shadow-lg transition-all',
          {
            'invisible -translate-y-2 opacity-0': !keyListOpen,
            'visible translate-y-0 opacity-100': keyListOpen,
          },
        )}
      />

      <Button type="button" onClick={() => toggleKeyListOpen()}>
        ♫ {selectedKey}
      </Button>
    </div>
  );
};
