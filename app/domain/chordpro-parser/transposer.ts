import { NOTES_BY_KEY } from './constants';
import type { Chord } from './types/Chord';
import type { Jsong } from './types/Jsong';
import type { Key } from './types/Key';
import { toRelativeMajor } from './utils/toRelativeMajor';
import { updateChordName } from './utils/updateChordName';

export const transposeJsongChords = (chords: Jsong['chords'], keyTo: Key) => {
  const targetMajorKey = toRelativeMajor(keyTo);
  if (targetMajorKey === 'Nashville') return chords;

  const targetScale = NOTES_BY_KEY[targetMajorKey];
  if (!targetScale) return chords;

  return chords.map((c) => {
    const chord: Chord = {
      ...c,
      root: targetScale[c.root],
      bass: c.bass ? targetScale[c.bass] : undefined,
    };
    return updateChordName(chord);
  });
};
