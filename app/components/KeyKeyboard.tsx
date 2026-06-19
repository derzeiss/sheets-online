import clsx from 'clsx';
import { useState, type FC, type RefObject } from 'react';
import type { Key } from '~/domain/chordpro-parser/types/Key';
import type { MajorKey } from '~/domain/chordpro-parser/types/MajorKey';
import { toParallelKey } from '~/domain/chordpro-parser/utils/toParallelKey';
import { Button } from './button/Button';
import type { BtnProps } from './button/getButtonCls';

interface KeyKeyboardProps {
  selectedKey: Key;
  onKeySelect: (key: Key) => void;
  className?: string;
  ref: RefObject<HTMLDivElement | null>;
}

export const KeyKeyboard: FC<KeyKeyboardProps> = ({
  className,
  ref,
  ...props
}) => {
  const [isMinor, setIsMinor] = useState(false);

  const handleIsMinorChange = () => {
    const newKey = toParallelKey(props.selectedKey);
    props.onKeySelect(newKey);
    setIsMinor(!isMinor);
  };

  return (
    <div className={clsx(className, 'w-fit space-y-1')} ref={ref}>
      <div className="mb-2 flex gap-1">
        <KeyButton {...props} _key="Nashville" />
        <div className="ml-auto flex items-center gap-2">
          <small className="text-xs">minor:</small>
          <Button
            size="sm"
            variant={isMinor ? 'selected' : 'secondary'}
            className="max-w-10"
            normalCasing
            onClick={handleIsMinorChange}
          >
            m
          </Button>
        </div>
      </div>
      <div className="flex gap-1">
        <KeyButton {...props} isMinor={isMinor} _key="C#" className="ml-6" />
        <KeyButton {...props} isMinor={isMinor} _key="D#" />
        <KeyButton {...props} isMinor={isMinor} _key="F#" className="ml-10" />
        <KeyButton {...props} isMinor={isMinor} _key="G#" />
        <KeyButton {...props} isMinor={isMinor} _key="A#" />
      </div>
      <div className="flex gap-1">
        <KeyButton {...props} isMinor={isMinor} _key="C" />
        <KeyButton {...props} isMinor={isMinor} _key="D" />
        <KeyButton {...props} isMinor={isMinor} _key="E" />
        <KeyButton {...props} isMinor={isMinor} _key="F" />
        <KeyButton {...props} isMinor={isMinor} _key="G" />
        <KeyButton {...props} isMinor={isMinor} _key="A" />
        <KeyButton {...props} isMinor={isMinor} _key="B" />
      </div>
      <div className="flex gap-1">
        <KeyButton {...props} isMinor={isMinor} _key="Db" className="ml-6" />
        <KeyButton {...props} isMinor={isMinor} _key="Eb" />
        <KeyButton {...props} isMinor={isMinor} _key="Gb" className="ml-10" />
        <KeyButton {...props} isMinor={isMinor} _key="Ab" />
        <KeyButton {...props} isMinor={isMinor} _key="Bb" />
      </div>
    </div>
  );
};

const KeyButton: FC<
  BtnProps &
    Omit<KeyKeyboardProps, 'ref'> & {
      _key: MajorKey | 'Nashville';
      isMinor?: boolean;
    }
> = ({ selectedKey, onKeySelect, _key, isMinor, ...props }) => {
  const key = isMinor ? toParallelKey(_key) : _key;
  return (
    <Button
      {...props}
      size="sm"
      variant={selectedKey === key ? 'selected' : 'secondary'}
      type="button"
      onClick={() => onKeySelect(key)}
      normalCasing
      className={clsx(props.className, { 'max-w-10': key !== 'Nashville' })}
    >
      {key}
    </Button>
  );
};
