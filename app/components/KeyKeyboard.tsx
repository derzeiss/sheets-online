import type { FC } from 'react';
import { Button, type ButtonProps } from './Button';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import { cx } from '~/utils/cx';

interface Props {
  selectedKey: Note;
  onKeySelect: (key: Note) => void;
  className?: string;
}

export const KeyKeyboard: FC<Props> = ({ className, ...props }) => {
  return (
    <div className={cx('w-fit space-y-2', className)}>
      <div className="flex gap-2">
        <KeyButton {...props} note="Nashville" />
      </div>
      <div className="flex gap-2">
        <KeyButton {...props} note="C#" className="ml-4" />
        <KeyButton {...props} note="D#" />
        <KeyButton {...props} note="F#" className="ml-6" />
        <KeyButton {...props} note="G#" />
        <KeyButton {...props} note="A#" />
      </div>
      <div className="flex gap-2">
        <KeyButton {...props} note="C" />
        <KeyButton {...props} note="D" />
        <KeyButton {...props} note="E" />
        <KeyButton {...props} note="F" />
        <KeyButton {...props} note="G" />
        <KeyButton {...props} note="A" />
        <KeyButton {...props} note="B" />
      </div>
      <div className="flex gap-2">
        <KeyButton {...props} note="Db" className="ml-4" />
        <KeyButton {...props} note="Eb" />
        <KeyButton {...props} note="Gb" className="ml-6" />
        <KeyButton {...props} note="Ab" />
        <KeyButton {...props} note="Bb" />
      </div>
    </div>
  );
};

const KeyButton: FC<ButtonProps & Props & { note: Note }> = ({
  selectedKey,
  onKeySelect,
  note,
  className,
  ...props
}) => (
  <Button
    {...props}
    className={cx(className, { 'outline outline-4 outline-blue-500': selectedKey === note })}
    onClick={() => onKeySelect(note)}
  >
    {note}
  </Button>
);
