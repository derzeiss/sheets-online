export function toSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  replacements.forEach(([from, to]) => {
    str = str.replaceAll(from, to);
  });

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+|-+$/g, ''); // remove leading and trailing dashes

  return str;
}

const replacements = [
  ['à', 'a'],
  ['á', 'a'],
  ['ä', 'ae'],
  ['â', 'a'],
  ['è', 'e'],
  ['é', 'e'],
  ['ë', 'e'],
  ['ê', 'e'],
  ['ì', 'i'],
  ['í', 'i'],
  ['ï', 'i'],
  ['î', 'i'],
  ['ò', 'o'],
  ['ó', 'o'],
  ['ö', 'oe'],
  ['ô', 'o'],
  ['ù', 'u'],
  ['ú', 'u'],
  ['ü', 'ue'],
  ['û', 'u'],
  ['ñ', 'n'],
  ['ç', 'c'],
  ['·', '-'],
  ['/', '-'],
  ['_', '-'],
  [',', '-'],
  [':', '-'],
  [';', '-'],
];
