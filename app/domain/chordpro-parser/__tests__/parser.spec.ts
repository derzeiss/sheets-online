import { describe, expect, it } from 'vitest';
import {
  _parseChord,
  _parseDirective,
  _setMetaField,
  parseSong,
} from '../parser';
import type { Chord } from '../types/Chord';
import type { Jsong } from '../types/Jsong';
import type { Note } from '../types/Note';

describe('parser', () => {
  describe('parseSong', () => {
    it('should parse a pure lyrics line', () => {
      const jsong = parseSong(`{key: C}
Einfach nur Text`);

      const expected = {
        meta: { key: 'C' },
        chords: [],
        lines: [{ id: 2, type: 'lyrics-only', content: 'Einfach nur Text' }],
      };

      expect(jsong).toEqual(expected);
    });

    it('should parse a line that starts with lyrics', () => {
      const jsong = parseSong(`{key: D}
There's [D]just one chief end to man's purpose    [Dmaj7]`);

      const expected = {
        meta: { key: 'D' },
        chords: [
          { name: '1', root: '1', optional: false },
          { name: '1maj7', root: '1', optional: false, ext: 'maj7' },
        ],
        lines: [
          {
            id: 4,
            type: 'with-chords',
            content: [
              { id: 1, chord: null, text: "There's " },
              {
                id: 2,
                chord: 0,
                text: "just one chief end to man's purpose    ",
              },
              { id: 3, chord: 1, text: '' },
            ],
          },
        ],
      };

      expect(jsong).toEqual(expected);
    });

    it('should parse a line that starts with a chord', () => {
      const jsong = parseSong(`{key:G}
{comment: Verse 1}
[Am]All of creation all of the earth`);
      const expected = {
        meta: { key: 'G' },
        chords: [{ name: '2m', root: '2', optional: false, qual: 'm' }],
        lines: [
          { id: 1, type: 'comment', content: 'Verse 1' },
          {
            id: 3,
            type: 'with-chords',
            content: [
              { id: 2, chord: 0, text: 'All of creation all of the earth' },
            ],
          },
        ],
      };

      expect(jsong).toEqual(expected);
    });
  });

  describe('setMetaField', () => {
    it('should create a non-existing field', () => {
      const meta: Jsong['meta'] = { key: 'C' };
      _setMetaField(meta, 'foo', 'bar');
      expect(meta.foo).toBe('bar');
    });

    it('should override an existing field', () => {
      const meta: Jsong['meta'] = { key: 'C', bar: 'baz' };
      _setMetaField(meta, 'bar', 'boom');
      expect(meta.bar).toBe('boom');
    });

    it('should create a non-existing additive field', () => {
      const meta: Jsong['meta'] = { key: 'C' };
      _setMetaField(meta, 'artist', 'John Doe');
      expect(meta.artist).toBe('John Doe');
    });

    it('should extend an existing additive field', () => {
      const meta: Jsong['meta'] = { key: 'C', artist: 'Jane' };
      _setMetaField(meta, 'artist', 'Carter, Ben');
      expect(meta.artist).toBe('Jane; Carter, Ben');
    });
  });

  describe('parseDirective', () => {
    it("should return null if there's no colon", () => {
      const result = _parseDirective('{nothing here}');
      expect(result).toBeNull();
    });

    it('should extract key and value correctly', () => {
      const result = _parseDirective('{foo:bar}');
      expect(result).toEqual(['foo', 'bar']);
    });

    it('should use the first colon as key-value separator', () => {
      const result = _parseDirective('{foo:bar:baz}');
      expect(result).toEqual(['foo', 'bar:baz']);
    });
  });

  describe('parseChord', () => {
    it.each([
      'C',
      'C#',
      'Db',
      'D',
      'D#',
      'Eb',
      'E',
      'F',
      'F#',
      'Gb',
      'G',
      'G#',
      'Ab',
      'A',
      'A#',
      'Bb',
      'B',
    ])('should parse base chord "%s"', (str) => {
      const expected: Chord = {
        name: str,
        root: str as Note,
        optional: false,
        qual: undefined,
        ext: undefined,
        bass: undefined,
      };
      expect(_parseChord(str)).toEqual(expected);
    });

    it.each([
      '1',
      '1#',
      '2b',
      '2',
      '2#',
      '3b',
      '3',
      '3#',
      '4b',
      '4',
      '4#',
      '5b',
      '5',
      '5#',
      '6b',
      '6',
      '6#',
      '7b',
      '7',
      '7#',
    ])('should parse basic nashville chord "%s"', (str) => {
      const expected: Chord = {
        name: str,
        root: str as Note,
        optional: false,
        qual: undefined,
        ext: undefined,
        bass: undefined,
      };
      expect(_parseChord(str)).toEqual(expected);
    });

    it.each(['c', 'H', 'Q', '8', '92'])(
      'should parse invalid chord "%s" as null',
      (str) => {
        expect(_parseChord(str)).toBeNull();
      },
    );

    it('should detect extensions', () => {
      expect(_parseChord('Csus2')).toEqual({
        name: 'Csus2',
        root: 'C',
        ext: 'sus2',
        optional: false,
      });
    });

    it('should detect extensions (nashville)', () => {
      expect(_parseChord('3sus9')).toEqual({
        name: '3sus9',
        root: '3',
        ext: 'sus9',
        optional: false,
      });
    });

    it('should detect m qual', () => {
      expect(_parseChord('Ebm7')).toEqual({
        name: 'Ebm7',
        root: 'Eb',
        qual: 'm',
        ext: '7',
        optional: false,
      });
    });

    it('should detect m qual (nashville)', () => {
      expect(_parseChord('6m7')).toEqual({
        name: '6m7',
        root: '6',
        qual: 'm',
        ext: '7',
        optional: false,
      });
    });

    it('should detect maj as extension not qual', () => {
      expect(_parseChord('D#maj7')).toEqual({
        name: 'D#maj7',
        root: 'D#',
        ext: 'maj7',
        optional: false,
      });
    });

    it('should detect maj as extension not qual (nashville)', () => {
      expect(_parseChord('6#maj7')).toEqual({
        name: '6#maj7',
        root: '6#',
        ext: 'maj7',
        optional: false,
      });
    });

    it('should parse optional chord with bass correctly', () => {
      expect(_parseChord('(D/F#)')).toEqual({
        name: '(D/F#)',
        root: 'D',
        bass: 'F#',
        optional: true,
      });
    });

    it('should parse optional chord with bass correctly (nashville)', () => {
      expect(_parseChord('(1/4)')).toEqual({
        name: '(1/4)',
        root: '1',
        bass: '4',
        optional: true,
      });
    });

    it('should parse optional complex chord correctly', () => {
      expect(_parseChord('(3#m7/7)')).toEqual({
        name: '(3#m7/7)',
        root: '3#',
        qual: 'm',
        ext: '7',
        bass: '7',
        optional: true,
      });
    });
  });
});
