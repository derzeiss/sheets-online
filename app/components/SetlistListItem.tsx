import type { Setlist } from '@prisma/client';
import type { FC } from 'react';

interface Props {
  setlist: Setlist;
}

export const SetlistListItem: FC<Props> = ({ setlist }) => {
  return (
    <li className="border-t-300 flex justify-between border-t px-2 py-1">
      <div>
        <h2>{setlist.name}</h2>
        {/* <div className="text-sm text-neutral-600">{setlist.songPreview}</div> */}
      </div>
      <div>{setlist.songAmount}</div>
    </li>
  );
};
