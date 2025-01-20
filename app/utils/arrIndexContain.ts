/**
 * TODO: Better name
 * @param arr
 * @param index
 * @returns
 */
export const arrIndexContain = (arr: unknown[], index: number) => (arr.length + index) % arr.length;
