import type { Chord } from '../types/Chord';
import type { NashvilleChord } from '../types/NashvilleChord';

/**
 * Update the name of a chord from the other fields (root, qual, ext, bass, optional) in-place.
 * @param chord chord to update
 * @example updateChordName({name: '', root: 'C', ext: 'maj7', bass: 'E', optional: false}) -> {name: 'Cmaj7/E', root: 'C', ext: 'maj7', bass: 'E', optional: false}
 * @returns updated chord
 */
export const updateChordName = <T extends Chord | NashvilleChord>(chord: T) => {
  let name = chord.root + (chord.qual || '') + (chord.ext || '');
  if (chord.bass) name += '/' + chord.bass;
  if (chord.optional) name = `(${name})`;
  chord.name = name;
  return chord;
};
