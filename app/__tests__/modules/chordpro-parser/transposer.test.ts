import { it, describe, expect } from 'vitest';
import { _extractNoteFromChord } from '~/modules/chordpro-parser/transposer';

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
    ])('should extract a valid ChordPart array from "%s"', (chord, partsExp) => {
      const parts = _extractNoteFromChord(chord);
      expect(parts).toStrictEqual(partsExp);
    });
  });
});
