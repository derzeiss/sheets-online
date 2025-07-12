export interface DragConfig {
  /** If true, items can be dragged into this. */
  isContainer: boolean;
  /** CSS-class to signal the item will be put above this dropzone. */
  dropAtTopCls: string;
  /** CSS-class to signal the item will be put below this dropzone. */
  dropAtBottomCls: string;
  /** CSS-class to signal the item will be inserted into this dropzone. */
  dropIntoCls: string;
  /** CSS-class to signal this item is currently dragged. */
  isDraggedCls: string;
}
