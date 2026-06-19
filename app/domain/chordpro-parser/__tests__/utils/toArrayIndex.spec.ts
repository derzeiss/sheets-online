import { describe, expect, it } from 'vitest';
import { clampToArrLength } from '../../utils/clampToArrLength';

describe('toArrayIndex', () => {
  it.each([
    [1, 3, 1],
    [2, 3, 2],
  ])(
    'should handle positive indexes',
    (index, arrLength, expectedClampedIndex) => {
      expect(clampToArrLength(index, arrLength)).toBe(expectedClampedIndex);
    },
  );

  it.each([
    [4, 3, 1],
    [19, 3, 1],
  ])(
    'should handle indexes greater than arr.length',
    (index, arrLength, expectedClampedIndex) => {
      expect(clampToArrLength(index, arrLength)).toBe(expectedClampedIndex);
    },
  );

  it.each([
    [-1, 3, 2],
    [-3, 3, 0],
    [-4, 3, 2],
    [-9, 12, 3],
  ])(
    'should handle negative indexes',
    (index, arrLength, expectedClampedIndex) => {
      expect(clampToArrLength(index, arrLength)).toBe(expectedClampedIndex);
    },
  );
});
