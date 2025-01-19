import { ADDITIVE_DIRECTIVES, FORMAT_DIRECTIVES, META_DIRECTIVES } from './constants';
import type { Jsong } from './types/Jsong';

export const parseSong = (song: string): Jsong => {
  let nextId = 1;
  const meta: Jsong['meta'] = { key: 'C' };
  const lines: Jsong['lines'] = [];

  song.split('\n').map((line) => {
    line = line.trim();

    // is directive
    if (line.startsWith('{') && line.endsWith('}')) {
      const lineTrimmed = line.substring(1, line.length - 1);
      const [name, _val, tooLong] = lineTrimmed.split(':');
      const val = tooLong ? lineTrimmed.substring(name.length + 1).trim() : _val.trim();

      if (META_DIRECTIVES.includes(name)) {
        if (meta[name] && ADDITIVE_DIRECTIVES.includes(name)) {
          meta[name] = `${meta[name]}; ${val}`;
        } else {
          meta[name] = val;
        }
      } else if (FORMAT_DIRECTIVES.includes(name)) {
        lines.push({ id: nextId++, type: 'comment', content: val });
      } else {
        lines.push({ id: nextId++, type: 'lyrics-only', content: line });
      }
    } else {
      // whitespace
      if (!line) {
        if (lines.length) {
          lines.push({ id: nextId++, type: 'whitespace', content: '' }); // don't push whitespace as first line
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

        if (blocks.length > 1) {
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
