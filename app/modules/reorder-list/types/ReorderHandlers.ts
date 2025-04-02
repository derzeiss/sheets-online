import type { DragEvent } from 'react';

export interface ReorderHandlers {
  onDragStart: (ev: DragEvent<HTMLElement>) => void;
  onDragEnter: (ev: DragEvent<HTMLElement>) => void;
  onDragOver: (ev: DragEvent<HTMLElement>) => void;
  onDragLeave: (ev: DragEvent<HTMLElement>) => void;
  onDrop: (ev: DragEvent<HTMLElement>) => void;
  draggable: boolean;
}
