import { ADDITIVE_DIRECTIVES, FORMAT_DIRECTIVES } from './constants';
import type { Block } from './types/Block';
import type { Jsong } from './types/Jsong';
import type { SongLine } from './types/SongLine';

let __nextId = 1;
const getNextId = () => __nextId++;

export const _extractDirectiveData = (lineTrimmed: string) => {
  const iFirstColon = lineTrimmed.indexOf(':');
  if (iFirstColon === -1) return null;
  const name = lineTrimmed.substring(1, iFirstColon);
  const val = lineTrimmed.substring(iFirstColon + 1, lineTrimmed.length - 1).trim();
  return [name, val];
};

export const _setMetaField = (meta: Jsong['meta'], name: string, val: string) => {
  if (meta[name] && ADDITIVE_DIRECTIVES.includes(name)) {
    meta[name] = `${meta[name]}; ${val}`;
  } else {
    meta[name] = val;
  }
};

const parseLine = (line: string): SongLine => {
  let lineHasText = false;
  const blocks = line.split('[').reduce<Block[]>((blocks, block) => {
    if (!block) return blocks;
    let [chord, text] = block.split(']');
    if (!text) {
      if (block.indexOf(']') === -1) {
        text = chord;
        chord = '';
      }
    }
    if (!lineHasText && text.trim().length > 0) lineHasText = true;
    blocks.push({ id: getNextId(), chord, text });
    return blocks;
  }, []);

  // with-chords / chords-only
  if (blocks.length > 1 || blocks[0]?.chord) {
    const type = lineHasText ? 'with-chords' : 'chords-only';
    return { id: getNextId(), type, content: blocks };
  }
  // lyrics-only
  else {
    return { id: getNextId(), type: 'lyrics-only', content: line };
  }
};

export const parseSong = (prosong: string): Jsong => {
  const meta: Jsong['meta'] = { key: 'C' };
  const lines: Jsong['lines'] = [];

  prosong.split('\n').map((line) => {
    const lineTrimmed = line.trim();

    // is directive
    if (lineTrimmed.startsWith('{') && lineTrimmed.endsWith('}')) {
      const directive = _extractDirectiveData(lineTrimmed);
      if (directive) {
        const [name, val] = directive;

        if (FORMAT_DIRECTIVES.includes(name)) {
          lines.push({ id: getNextId(), type: 'comment', content: val });
        } else {
          _setMetaField(meta, name, val);
        }
      }
    } else {
      // whitespace
      if (!lineTrimmed) {
        // don't push whitespace as first line
        if (lines.length) {
          lines.push({ id: getNextId(), type: 'whitespace', content: '' });
        }
      } else {
        lines.push(parseLine(line));
      }
    }
  });

  return {
    meta,
    lines,
  };
};
