import { describe, expect, it } from 'vitest';
import { _extractDirectiveData, _setMetaField } from '../parser';
import type { Jsong } from '../types/Jsong';

describe('parser', () => {
  describe('extractDirectiveData', () => {
    it("should return null if there's no colon", () => {
      const result = _extractDirectiveData('{nothing here}');
      expect(result).toBeNull();
    });

    it('should extract key and value correctly', () => {
      const result = _extractDirectiveData('{foo:bar}');
      expect(result).toEqual(['foo', 'bar']);
    });

    it('should use the first colon as key-value separator', () => {
      const result = _extractDirectiveData('{foo:bar:baz}');
      expect(result).toEqual(['foo', 'bar:baz']);
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
  });
});
