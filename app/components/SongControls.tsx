import type { FC } from 'react';
import { NOTES_SHARP } from '~/modules/chordpro-parser/constants';
import type { Note } from '~/modules/chordpro-parser/types/Note';

interface Props {
  targetKey: Note;
  onKeyUpdated: (key: Note) => void;
}

export const SongControls: FC<Props> = ({ targetKey, onKeyUpdated }) => {
  return (
    <div className="mb-2 text-sm">
      Key:
      <select
        className="rounded-sm bg-neutral-100 px-2 py-1"
        value={targetKey}
        onChange={(ev) => onKeyUpdated(ev.target.value as Note)}
      >
        {NOTES_SHARP.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
        <option value="Nashville">Nashville</option>
      </select>
    </div>
  );
};
