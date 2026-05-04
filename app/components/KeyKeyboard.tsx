import clsx from 'clsx';
import type { FC, RefObject } from 'react';
import type { Note } from '~/domain/chordpro-parser/types/Note';
import { Button } from './button/Button';
import type { BtnProps } from './button/getButtonCls';

interface KeyKeyboardProps {
  selectedKey: Note;
  onKeySelect: (key: Note) => void;
  className?: string;
  ref: RefObject<HTMLDivElement | null>;
}

export const KeyKeyboard: FC<KeyKeyboardProps> = ({
  className,
  ref,
  ...props
}) => {
  return (
    <div className={clsx(className, 'w-fit space-y-1')} ref={ref}>
      <div className="mb-2 flex gap-1">
        <KeyButton {...props} note="Nashville" />
      </div>
      <div className="flex gap-1">
        <KeyButton {...props} note="C#" className="ml-4" />
        <KeyButton {...props} note="D#" />
        <KeyButton {...props} note="F#" className="ml-6" />
        <KeyButton {...props} note="G#" />
        <KeyButton {...props} note="A#" />
      </div>
      <div className="flex gap-1">
        <KeyButton {...props} note="C" />
        <KeyButton {...props} note="D" />
        <KeyButton {...props} note="E" />
        <KeyButton {...props} note="F" />
        <KeyButton {...props} note="G" />
        <KeyButton {...props} note="A" />
        <KeyButton {...props} note="B" />
      </div>
      <div className="flex gap-1">
        <KeyButton {...props} note="Db" className="ml-4" />
        <KeyButton {...props} note="Eb" />
        <KeyButton {...props} note="Gb" className="ml-6" />
        <KeyButton {...props} note="Ab" />
        <KeyButton {...props} note="Bb" />
      </div>
    </div>
  );
};

const KeyButton: FC<
  BtnProps & Omit<KeyKeyboardProps, 'ref'> & { note: Note }
> = ({ selectedKey, onKeySelect, note, className, ...props }) => (
  <Button
    {...props}
    size="sm"
    variant={selectedKey === note ? 'selected' : 'secondary'}
    type="button"
    onClick={() => onKeySelect(note)}
  >
    {note}
  </Button>
);
