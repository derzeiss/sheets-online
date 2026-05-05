import { CancelIcon } from '@proicons/react';
import { useMemo, type FC } from 'react';
import { isNote } from '~/domain/chordpro-parser/typeguards';
import type { Note } from '~/domain/chordpro-parser/types/Note';
import type { ReorderType } from '~/domain/reorder-list/types/ReorderType';
import { useReorderList } from '~/domain/reorder-list/useReorderList';
import { getSongKey } from '~/domain/utils/getSongKey';
import type { SetlistItemWithSong } from '~/prismaExtensions';
import { Button } from '../button/Button';
import { KeySelectButton } from '../KeySelectButton';
import { TextMeta } from '../TextMeta';
import { ListItem } from './ListItem';

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
    <ListItem {...getReorderHandlers(item.id)} className="select-none">
      <div>
        <h2>{item.song.title}</h2>
        <TextMeta>{item.song.artist}</TextMeta>
      </div>

      <div className="flex gap-2">
        <KeySelectButton
          selectedKey={songKey || 'C'}
          onKeySelect={handleKeyChange}
          closeOnSelect
        />
        <input name="key" type="hidden" value={songKey || ''} />

        <Button
          key={item.id}
          size="sm_icon"
          variant="danger"
          onClick={() => onItemRemove(item.id)}
          type="button"
        >
          <CancelIcon size={20} />
        </Button>
      </div>
    </ListItem>
  );
};
