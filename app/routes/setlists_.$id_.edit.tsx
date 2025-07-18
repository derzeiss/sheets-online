import type { Song } from '@prisma/client';
import { useState, type FormEvent } from 'react';
import { data, Form, useSubmit } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { ConfirmButton } from '~/components/ConfirmButton';
import { SongListItem } from '~/components/SongListItem';
import { deleteSetlist, upsertSetlist } from '~/dal/setlist';
import { NOTES_ALL } from '~/modules/chordpro-parser/constants';
import { isNote } from '~/modules/chordpro-parser/typeguards';
import { prisma } from '~/modules/prisma';
import type { ReorderType } from '~/modules/reorder-list/types/ReorderType';
import { useReorderList } from '~/modules/reorder-list/useReorderList';
import { setlistWithItemsWithSongInclude, type SetlistWithItemWithSong } from '~/prismaExtensions';
import type { SetlistItemClientDTO, SetlistItemWithSongClientDTO } from '~/schemas';
import type { Route } from './+types/setlists_.$id_.edit';

const blankSetlist: SetlistWithItemWithSong = {
  id: 'new',
  name: '',
  songAmount: 0,
  items: [],
};

export async function loader({ params }: Route.LoaderArgs) {
  const songs = await prisma.song.findMany({ orderBy: { title: 'asc' } });
  if (!songs) throw data('Error while fetching songs for setlist.', { status: 500 });

  if (params.id === 'new') return { setlist: { ...blankSetlist }, songs };

  const setlist = await prisma.setlist.findFirst({
    where: { id: params.id },
    include: setlistWithItemsWithSongInclude,
  });
  if (!setlist) throw data(`Setlist "${params.id}" not found.`, { status: 404 });

  return { setlist, songs };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (!values.id || typeof values.id !== 'string') {
    throw data('No setlist id given.', { status: 400 });
  }

  switch (values._action) {
    case 'save':
      return await upsertSetlist(values);
    case 'delete':
      return await deleteSetlist(values.id);
  }
}

const reorderSetlistItems = (
  setlistItems: SetlistItemWithSongClientDTO[],
  dragId: string,
  dropId: string,
  dropType: ReorderType,
) => {
  const iDrag = parseInt(dragId);
  const iDrop = parseInt(dropId);
  if (isNaN(iDrag) || isNaN(iDrop)) return;
  const iMin = Math.min(iDrag, iDrop);
  const iMax = Math.max(iDrag, iDrop);
  const draggedItem = { ...setlistItems[iDrag], _updated: true };

  return setlistItems.reduce<SetlistItemWithSongClientDTO[]>((reordered, item, index) => {
    if (index === iDrag) return reordered;
    if (index === iDrop && dropType === 'putBefore') reordered.push(draggedItem);

    if (iMin <= index && iMax >= index) reordered.push({ ...item, _updated: true });
    else reordered.push(item);

    if (index === iDrop && dropType === 'putAfter') reordered.push(draggedItem);
    return reordered;
  }, []);
};

export default function SetlistsEditRoute({ loaderData }: Route.ComponentProps) {
  const { setlist, songs } = loaderData;
  const submit = useSubmit();
  const isCreation = setlist.id === 'new';
  const { getHandlers: getReorderHandlers } = useReorderList(handleSetlistItemsReorder);

  const [setlistItems, setSetlistItems] = useState<SetlistItemWithSongClientDTO[]>(setlist.items);

  function handleSetlistItemsReorder(dragId: string, dropId: string, dropType: ReorderType) {
    const reordered = reorderSetlistItems(setlistItems, dragId, dropId, dropType);
    if (reordered) setSetlistItems(reordered);
  }

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    let $form = ev.currentTarget;
    let formData = new FormData($form);

    const setlistItemDTO: SetlistItemClientDTO[] = setlistItems.map((item, index) => {
      const { song, ...itemWithoutSong } = item;
      if (itemWithoutSong._added && itemWithoutSong._updated) itemWithoutSong._updated = false;
      return { ...itemWithoutSong, order: index };
    });

    formData.set('setlistItems', JSON.stringify(setlistItemDTO));

    submit(formData, {
      method: 'post',
    });
  };

  const handleItemAdd = (song: Song) => {
    const newSetlistItem: SetlistItemWithSongClientDTO = {
      id: crypto.randomUUID(),
      key: song.key,
      order: 0,
      setlistId: setlist.id,
      songId: song.id,
      song,
      _added: true,
    };
    setSetlistItems([...setlistItems, newSetlistItem]);
  };

  const handleItemRemove = (id: string) => {
    setSetlistItems(
      setlistItems.reduce<SetlistItemWithSongClientDTO[]>((items, item) => {
        if (item.id !== id) items.push(item);
        else if (!item._added) {
          let uneditedItem: SetlistItemClientDTO | undefined = setlist.items.find(
            (_item) => _item.id === item.id,
          );
          if (!uneditedItem) uneditedItem = { ...item, _updated: false };
          items.push({
            ...uneditedItem,
            song: item.song,
            _deleted: true,
            _updated: false,
          });
        }
        return items;
      }, []),
    );
  };

  const handleKeyChange = (item: SetlistItemWithSongClientDTO, key: string) => {
    if (!isNote(key)) return;

    const newItem = { ...item, key, _updated: true };
    setSetlistItems([...setlistItems.map((_item) => (_item.id === newItem.id ? newItem : _item))]);
  };

  return (
    <main className="content my-10 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl">{isCreation ? 'Create' : 'Edit'} Setlist</h1>
        <Form method="post">
          <input type="hidden" name="id" value={setlist.id} />
          <input type="hidden" name="_action" value="delete" />
          <ConfirmButton className="bg-red-200" type="submit">
            Delete Setlist
          </ConfirmButton>
        </Form>
      </div>
      <Form onSubmit={handleSubmit} method="post">
        <label htmlFor="name" className="mb-1 block text-sm font-semibold">
          Setlist Name
        </label>
        <input
          id="name"
          name="name"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          defaultValue={setlist.name}
          required
        />

        <h2 className="mt-6 text-2xl">Songs</h2>

        <ul className="mt-4">
          {setlistItems
            .filter((item) => !item._deleted)
            .map((item, index) => (
              <li
                key={item.id}
                className="relative flex w-full justify-between gap-2 border-t border-t-neutral-200 px-2 py-1 text-left select-none"
                {...getReorderHandlers(index + '')} // TODO: don't use index
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
                  {NOTES_ALL.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  key={item.id}
                  onClick={() => handleItemRemove(item.id)}
                  className="btn bg-red-100"
                  type="button"
                >
                  X
                </button>
              </li>
            ))}
        </ul>

        <h2 className="mt-6 text-2xl">Add songs</h2>

        <ul className="mt-4">
          {songs.map((song) => (
            <button
              key={song.id}
              onClick={() => handleItemAdd(song)}
              className="block w-full"
              type="button"
            >
              <SongListItem song={song} />
            </button>
          ))}
        </ul>

        <div className="fixed bottom-0 left-0 w-full border-t border-t-neutral-200 bg-white py-3">
          <div className="px-content mx-auto flex max-w-3xl gap-4">
            <Button type="submit">Save</Button>
            <ButtonLink to={`/setlists/${isCreation ? '' : setlist.id}`}>Cancel</ButtonLink>
          </div>
        </div>

        <input type="hidden" name="id" value={setlist.id} />
        <input type="hidden" name="_action" value="save" />
      </Form>
    </main>
  );
}
