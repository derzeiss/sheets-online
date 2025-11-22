import { useMemo, type FC } from 'react';
import { isNote } from '~/domain/chordpro-parser/typeguards';
import type { Note } from '~/domain/chordpro-parser/types/Note';
import type { ReorderType } from '~/domain/reorder-list/types/ReorderType';
import { useReorderList } from '~/domain/reorder-list/useReorderList';
import type { SetlistItemWithSong } from '~/prismaExtensions';
import { getSongKey } from '~/domain/utils/getSongKey';
import { KeySelectButton } from './KeySelectButton';

interface Props {
  item: SetlistItemWithSong;
  onItemUpdate: (item: SetlistItemWithSong) => void;
  onItemRemove: (id: string) => void;
  onItemsReorder: (dragId: string, dropId: string, type: ReorderType) => void;
}

export const SetlistItemEdit: FC<Props> = ({
  item,
  onItemUpdate,
  onItemRemove,
  onItemsReorder,
}) => {
  const { getHandlers: getReorderHandlers } = useReorderList(onItemsReorder);
  const songKey = useMemo(() => getSongKey(item), [item.key]);

  const handleKeyChange = (key: Note) => {
    if (!isNote(key)) return;
    onItemUpdate({ ...item, key });
  };

  return (
    <li
      className="relative flex w-full justify-between gap-2 border-t border-t-neutral-200 px-2 py-1 text-left select-none"
      {...getReorderHandlers(item.id)}
    >
      <div className="grow overflow-hidden">
        <h2>{item.song.title}</h2>
        <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap text-neutral-600">
          {item.song.artist}
        </div>
      </div>

      <KeySelectButton
        selectedKey={songKey || 'C'}
        onKeySelect={handleKeyChange}
        closeOnSelect
      />
      <input name="key" type="hidden" value={songKey || ''} />

      <button
        key={item.id}
        onClick={() => onItemRemove(item.id)}
        className="btn bg-red-100"
        type="button"
      >
        X
      </button>
    </li>
  );
};
