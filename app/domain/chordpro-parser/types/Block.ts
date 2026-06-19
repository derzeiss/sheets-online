/**
 * Jsong Block containing chord and text info about (part of) a line of a sheet.
 */
export type Block = {
  id: number;
  chord: number | null;
  text: string;
};
