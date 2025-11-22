import { describe, expect, it } from 'vitest';
import {
  _extractNoteFromChord,
  _extractNotesFromChord,
  _getKeyDelta,
  _toArrayIndex,
  _transposeNote,
} from '../transposer';
import type { Note } from '../types/Note';

describe('transposer', () => {
  describe('extractNoteFromChord', () => {
    it.each([
      ['C', ['C', '']],
      ['D#', ['D#', '']],
      ['Ab', ['Ab', '']],
      ['Emaj7', ['E', 'maj7']],
      ['Falskjdlak', ['F', 'alskjdlak']],
      ['Gm7', ['G', 'm7']],
      ['Bbm', ['Bb', 'm']],
    ])(
      'should extract a valid ChordPart array from "%s"',
      (chord, partsExpected) => {
        const parts = _extractNoteFromChord(chord);
        expect(parts).toStrictEqual(partsExpected);
      },
    );
  });

  describe('extractNotesFromChord', () => {
    it.each([
      [
        'A/B',
        [
          ['A', ''],
          ['B', ''],
        ],
      ],
      [
        'C#maj7/Gbsus9',
        [
          ['C#', 'maj7'],
          ['Gb', 'sus9'],
        ],
      ],
      [
        'abc/def',
        [
          ['ab', 'c'],
          ['d', 'ef'],
        ],
      ],
      [
        'A2/C#',
        [
          ['A', '2'],
          ['C#', ''],
        ],
      ],
    ])('should extract notes correctly', (chord, partsExpected) => {
      const parts = _extractNotesFromChord(chord);
      expect(parts).toStrictEqual(partsExpected);
    });
  });

  describe('getKeyDelta', () => {
    it.each<[Note, Note, number]>([
      ['C', 'D', 2],
      ['D', 'G', 5],
      ['A', 'C', -9],
      ['Ab', 'Bb', 2],
      ['Gb', 'C#', -5],
    ])(
      'should calculate key-delta correctly',
      (keyFrom, keyTo, expectedDelta) => {
        const delta = _getKeyDelta(keyFrom, keyTo);
        expect(delta).toBe(expectedDelta);
      },
    );
  });

  describe('toArrayIndex', () => {
    it.each([
      [3, 1, 1],
      [3, 2, 2],
    ])(
      'should handle positive indexes',
      (arrLength, index, expectedClampedIndex) => {
        expect(_toArrayIndex(arrLength, index)).toBe(expectedClampedIndex);
      },
    );

    it.each([
      [3, 4, 1],
      [3, 19, 1],
    ])(
      'should handle indexes greater than arr.length',
      (arrLength, index, expectedClampedIndex) => {
        expect(_toArrayIndex(arrLength, index)).toBe(expectedClampedIndex);
      },
    );

    it.each([
      [3, -1, 2],
      [3, -3, 0],
      [3, -4, 2],
      [12, -9, 3],
    ])(
      'should handle negative indexes',
      (arrLength, index, expectedClampedIndex) => {
        expect(_toArrayIndex(arrLength, index)).toBe(expectedClampedIndex);
      },
    );
  });

  describe('transposeNote', () => {
    it.each<[Note, Note, number, string]>([
      ['C', 'D', 2, 'D'], // key: C -> D
      ['D', 'C', -9, 'F'], //  key: A -> C; note: D  -> F (Nashville 4)
      ['C#', 'C', -9, 'E'], // key: A -> C; note: C# -> E (Nashville 3)
    ])(
      'should transpose notes correctly',
      (note, keyTo, delta, expectedNote) => {
        const transposed = _transposeNote(note, keyTo, delta);
        expect(transposed).toBe(expectedNote);
      },
    );
  });
});
