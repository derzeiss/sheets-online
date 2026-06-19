/**
 * functional and more performant version of {@link Array.prototype.includes}.
 * Searches for identity, not equality.
 * @param arr array to search
 * @param search search obj
 * @returns true if {@link arr} contains {@link search}, false if not.
 */
export const arrIncludes = <T extends unknown[]>(arr: T, search: unknown) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === search) return true;
  }
  return false;
};
