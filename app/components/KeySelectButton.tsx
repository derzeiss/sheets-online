import { useState, type FC } from 'react';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import { cx } from '~/utils/cx';
import { Button } from './Button';
import { KeyKeyboard } from './KeyKeyboard';

interface Props {
  selectedKey: Note;
  onKeySelect: (key: Note) => void;
}

export const KeySelectButton: FC<Props> = ({ selectedKey, onKeySelect }) => {
  const [keyListOpen, setKeyListOpen] = useState(false);

  return (
    <div className="relative mb-2 w-fit">
      <div
        className={cx('fixed inset-0', {
          hidden: !keyListOpen,
          visible: keyListOpen,
        })}
        onClick={() => setKeyListOpen(false)}
      />
      <KeyKeyboard
        selectedKey={selectedKey}
        onKeySelect={(note) => onKeySelect(note)}
        className={cx(
          'absolute left-0 top-[calc(100%+0.5rem)] rounded border bg-white p-2 shadow-lg transition-all',
          {
            'invisible -translate-y-2 opacity-0': !keyListOpen,
            'visible translate-y-0 opacity-100': keyListOpen,
          },
        )}
      />

      <Button onClick={() => setKeyListOpen(!keyListOpen)}>♫ {selectedKey}</Button>
    </div>
  );
};
