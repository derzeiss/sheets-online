import type { Song } from '@prisma/client';
import { useMemo, useRef, useState, type FormEvent } from 'react';
import { data, Form, useSubmit } from 'react-router';
import { Button } from '~/components/Button';
import { ButtonLink } from '~/components/ButtonLink';
import { ConfirmButton } from '~/components/ConfirmButton';
import { SetlistItemEdit } from '~/components/SetlistItemEdit';
import { SongListItem } from '~/components/SongListItem';
import { deleteSetlist, upsertSetlist } from '~/dal/setlistDal';
import { prisma } from '~/domain/prisma';
import type { ReorderType } from '~/domain/reorder-list/types/ReorderType';
import {
  setlistWithItemsWithSongInclude,
  type SetlistItemWithSong,
  type SetlistWithItemWithSong,
} from '~/prismaExtensions';
import { useClientList, type ClientListItem } from '~/utils/useClientList';
import type { Route } from './+types/setlists_.$id_.edit';

type SetlistItemWithSongClientDTO = ClientListItem<SetlistItemWithSong>;

const reorderSetlistItems = (
  setlistItems: SetlistItemWithSongClientDTO[],
  dragId: string,
  dropId: string,
  dropType: ReorderType,
) => {
  const itemDragged = setlistItems.find((_item) => _item.id === dragId);
  if (!itemDragged) return;

  return setlistItems.reduce<SetlistItemWithSongClientDTO[]>((reordered, item) => {
    if (item.id === dragId) return reordered;
    if (item.id === dropId && dropType === 'putBefore') reordered.push(itemDragged);
    reordered.push(item);
    if (item.id === dropId && dropType === 'putAfter') reordered.push(itemDragged);
    return reordered;
  }, []);
};

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

export default function SetlistsEditRoute({ loaderData }: Route.ComponentProps) {
  const submit = useSubmit();
  const { setlist, songs } = loaderData;
  const {
    items: setlistItems,
    setItems,
    addItem,
    removeItem,
    updateItem,
  } = useClientList<SetlistItemWithSong>(setlist.items);

  // add songs query
  const [songQuery, setSongQuery] = useState('');
  const $songQuery = useRef<HTMLInputElement>(null);
  const songListFiltered = useMemo(() => {
    if (songQuery.length < 2) return songs;
    const queryLower = songQuery.toLowerCase();
    return songs.filter((song) => song.title.toLowerCase().indexOf(queryLower) > -1);
  }, [songQuery]);

  const isCreation = setlist.id === 'new';

  function handleSetlistItemsReorder(dragId: string, dropId: string, dropType: ReorderType) {
    const reordered = reorderSetlistItems(setlistItems, dragId, dropId, dropType);
    if (reordered) setItems(reordered);
  }

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    let $form = ev.currentTarget;
    let formData = new FormData($form);

    const setlistItemDTOs = setlistItems.map((itemWithSong, index) => {
      const { song, ...item } = itemWithSong;
      if (item.order !== index) {
        item.order = index;
        item._updated = true;
      }
      if (item._added && item._updated) item._updated = false;
      return item;
    });

    const itemsFieldName: keyof SetlistWithItemWithSong = 'items'; // make sure we stay in-line with setlist prop names
    formData.set(itemsFieldName, JSON.stringify(setlistItemDTOs));

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
    };
    addItem(newSetlistItem);

    const songQuerySet = !!songQuery.length;
    setSongQuery('');
    if (songQuerySet) $songQuery.current?.focus();
  };

  return (
    <main className="content my-10 max-w-3xl pb-10">
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
              <SetlistItemEdit
                key={item.id}
                item={item}
                onItemUpdate={updateItem}
                onItemRemove={removeItem}
                onItemsReorder={handleSetlistItemsReorder}
              />
            ))}
        </ul>

        <h2 className="mt-6 text-2xl">Add songs</h2>

        <input
          className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2"
          value={songQuery}
          onChange={(ev) => setSongQuery(ev.target.value)}
          placeholder="Filter songs..."
          ref={$songQuery}
        />

        <ul className="mt-4">
          {songListFiltered.map((song) => (
            <button
              key={song.id}
              onClick={() => handleItemAdd(song)}
              className="clickable block w-full"
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
