import { ADDITIVE_DIRECTIVES, FORMAT_DIRECTIVES } from './constants';
import type { Jsong } from './types/Jsong';

export const parseSong = (prosong: string): Jsong => {
  let nextId = 1;
  const meta: Jsong['meta'] = { key: 'C' };
  const lines: Jsong['lines'] = [];

  prosong.split('\n').map((line) => {
    const lineTrim = line.trim();

    // is directive
    if (lineTrim.startsWith('{') && lineTrim.endsWith('}')) {
      const lineTrimmed = lineTrim.substring(1, lineTrim.length - 1);
      const [name, _val, tooLong] = lineTrimmed.split(':');
      const val = tooLong ? lineTrimmed.substring(name.length + 1)?.trim() : _val?.trim();

      if (FORMAT_DIRECTIVES.includes(name)) {
        lines.push({ id: nextId++, type: 'comment', content: val });
      } else {
        if (meta[name] && ADDITIVE_DIRECTIVES.includes(name)) {
          meta[name] = `${meta[name]}; ${val}`;
        } else {
          meta[name] = val;
        }
      }
    } else {
      // whitespace
      if (!lineTrim) {
        if (lines.length) {
          // don't push whitespace as first line
          lines.push({ id: nextId++, type: 'whitespace', content: '' });
        }
      } else {
        // parse chords
        const blocks = line
          .split('[')
          .filter(Boolean)
          .map((block) => {
            let [chord, text] = block.split(']');
            if (!text) {
              if (block.indexOf(']') === -1) {
                text = chord;
                chord = '';
              }
            }
            return { id: nextId++, chord, text };
          });

        if (blocks.length > 1 || blocks[0]?.chord) {
          lines.push({ id: nextId++, type: 'with-chords', content: blocks });
        }
        // lyrics-only
        else {
          lines.push({ id: nextId++, type: 'lyrics-only', content: line });
        }
      }
    }
  });

  return {
    meta,
    lines,
  };
};
