import type { FC } from 'react';
import { NOTES_ALL } from '~/modules/chordpro-parser/constants';
import { isNote } from '~/modules/chordpro-parser/typeguards';
import type { ReorderType } from '~/modules/reorder-list/types/ReorderType';
import { useReorderList } from '~/modules/reorder-list/useReorderList';
import type { SetlistItemWithSong } from '~/prismaExtensions';

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

  const handleKeyChange = (item: SetlistItemWithSong, key: string) => {
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

      <select
        className="btn w-20 flex-shrink-0"
        name="key"
        value={item.key || 'C'}
        onChange={(ev) => handleKeyChange(item, ev.target.value)}
      >
        {/* TODO: Use transpose keyboard */}
        {NOTES_ALL.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
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
