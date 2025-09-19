import { useState } from 'react';

export type ClientListItem<T extends object> = T & {
  _deleted?: boolean;
  _added?: boolean;
  _updated?: boolean;
};

type WithId = {
  id: string;
};

export const useClientList = <T extends WithId>(initialItems: T[]) => {
  const [items, setItems] = useState<ClientListItem<T>[]>(initialItems);

  const addItem = (item: T) => {
    setItems([...items, { ...item, _added: true }]);
  };

  const removeItem = (id: string) => {
    setItems(
      items.reduce<ClientListItem<T>[]>((_items, item) => {
        if (item.id !== id) _items.push(item);
        else if (!item._added) {
          _items.push({
            ...item,
            _deleted: true,
            _updated: false,
          });
        }
        return _items;
      }, []),
    );
  };

  const updateItem = (item: ClientListItem<T>) => {
    const newItem = { ...item, _updated: true };
    setItems(items.map((_item) => (_item.id === item.id ? newItem : _item)));
  };

  return { items, setItems, addItem, updateItem, removeItem };
};
