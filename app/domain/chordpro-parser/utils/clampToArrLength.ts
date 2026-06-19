/**
 * Clamp {@link index} to {@link arrLength} so that it can be used as an index
 * @example clampToArrLength([1,2,3], 1) -> 1
 * @example clampToArrLength([1,2,3], 4) -> 1
 * @example clampToArrLength([1,2,3], 7) -> 1
 * @example clampToArrLength([1,2,3], 8) -> 2
 * @example clampToArrLength([1,2,3], -8) -> 2
 */
export const clampToArrLength = (index: number, arrLength: number) => {
  if (index >= 0) return index % arrLength;
  // This rather complicated calculation is needed to account for negative values
  return ((index % arrLength) + arrLength) % arrLength;
};
