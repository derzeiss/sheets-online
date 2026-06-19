import { NOTES_BY_KEY } from './constants';
import type { Jsong } from './types/Jsong';
import type { Key } from './types/Key';
import { toRelativeMajor } from './utils/toRelativeMajor';

export const transposeJsongChords = (chords: Jsong['chords'], keyTo: Key) => {
  const targetMajorKey = toRelativeMajor(keyTo);
  if (targetMajorKey === 'Nashville') return chords;

  const targetScale = NOTES_BY_KEY[targetMajorKey];
  if (!targetScale) return chords;

  return chords.map((c) => {
    const root = targetScale[c.root];
    const bass = c.bass ? targetScale[c.bass] : undefined;
    let name = root + (c.qual || '') + (c.ext || '');
    if (bass) name += '/' + bass;
    if (c.optional) name = `(${name})`;
    return {
      ...c,
      name,
      root,
      bass,
    };
  });
};
