/**
 * clamp {@link index} to {@link arr.length} so that it can be used as an index
 * @example toArrayIndex([1,2,3], 1) -> 1
 * @example toArrayIndex([1,2,3], 4) -> 1
 * @example toArrayIndex([1,2,3], 7) -> 1
 * @example toArrayIndex([1,2,3], 8) -> 2
 */
export const toArrayIndex = (arr: unknown[], index: number) => index % arr.length;
