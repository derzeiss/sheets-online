import { describe, expect, it } from 'vitest';
import { isFlatNote } from '../../utils/isFlatNote';

describe('isFlatNote', () => {
  it.each([
    'Db',
    'Eb',
    'Gb',
    'Ab',
    'Bb',
    '(Db/A#)',
    '(Eb/C)',
    '(Gb)',
    '(Ab)',
    '(Bb)',
  ])('should detect "%s" as flat note', (note) => {
    expect(isFlatNote(note)).toBe(true);
  });

  it.each([
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
    '(A/Bb)',
    'bb',
    '(bb)',
    'Csus2/Db',
  ])('should detect "%s" as not flat note', (note) => {
    expect(isFlatNote(note)).toBe(false);
  });
});
