/**
 * Performant check if note is a flat note (Db, ...).
 * @param note note to check
 * @returns true if flat note, false if not
 */
export const isFlatNote = (note: string): boolean => {
  const iMod = note[0] === '(' ? 1 : 0;
  for (let i = iMod; i < note.length; i++) {
    const char = note[i];
    if (char === 'D') continue;
    if (char === 'E') continue;
    if (char === 'G') continue;
    if (char === 'A') continue;
    if (char === 'B') continue;
    if (char === 'b' && i > iMod) return true;
    return false;
  }
  return false;
};
