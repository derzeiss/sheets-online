export type SearchMatches = [start: number, end: number][];

/**
 * Prepare a search string to be used as preparedQuery in {@link wordSearch}.
 * @param query search query string
 * @returns prepared query
 */
export const prepareQuery = (query: string) =>
  query
    .toLowerCase()
    .trim()
    .split(' ')
    .filter((w) => !!w)
    .map((w) => w.replace(/[ \t\n]*/g, ''));

/**
 * Search a string word-wise and return the number of matched words.
 * @param preparedQuery query prepared with {@link prepareQuery}
 * @param input string to search through
 * @returns number of matched words from {@link preparedQuery}
 */
export const wordSearch = (preparedQuery: string[], input: string) => {
  let offset = 0;
  let score = 0;
  const matches: SearchMatches = [];

  input = input.toLowerCase();

  for (let i = 0; i < preparedQuery.length; i++) {
    const word = preparedQuery[i];
    const index = input.indexOf(word, offset);
    if (index === -1) break;
    score += word.length > 2 ? 2 : 1;
    offset = index + word.length;
    matches.push([index, offset]);
  }
  return { score, matches };
};

/**
 * Filters an array of objects by the given query.
 * @param query search query
 * @param filterField arr item field to search for, e.g. "title" to search an array of songs for their title
 * @param arr list to filter
 * @returns filtered list with optional score + matches fields on every item
 */
export const filterArray = <TItem, TArr extends TItem[] = TItem[]>(
  query: string,
  filterField: keyof TItem,
  arr: TArr,
) => {
  if (query.length < 2)
    return arr as (TItem & { score?: number; matches?: SearchMatches })[];
  const preparedQuery = prepareQuery(query);
  const arrFiltered = arr
    .map((i) => ({
      ...i,
      ...wordSearch(preparedQuery, i[filterField] + ''),
    }))
    .filter((s) => s.score > 0)
    .sort((s1, s2) => s2.score - s1.score);

  return arrFiltered;
};
