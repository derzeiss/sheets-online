import { describe, expect, it } from 'vitest';
import { prepareQuery, wordSearch } from '../wordSearch';

describe('wordSearch', () => {
  describe('prepareQuery', () => {
    it('should split a query by spaces', () => {
      const pQuery = prepareQuery('look i am a query');
      expect(pQuery.length).toBe(5);
      expect(pQuery).toEqual(['look', 'i', 'am', 'a', 'query']);
    });

    it('should convert a query to lower case', () => {
      const pQuery = prepareQuery('Well tHAt is WEIRD CaSiNg');
      expect(pQuery).toEqual(['well', 'that', 'is', 'weird', 'casing']);
    });

    it('should trim the query before converting it', () => {
      const pQuery = prepareQuery(
        '    i have   weird   whitespace  \n           ',
      );
      expect(pQuery).toEqual(['i', 'have', 'weird', 'whitespace']);
    });
  });

  describe('wordSearch', () => {
    it('should reward 1-2 char matches with 1 score', () => {
      const pQuery = prepareQuery('i a f');
      const { score } = wordSearch(pQuery, 'I am Five Words Long');
      expect(score).toBe(3);
    });
    it('should reward 3+ char matches with 2 score', () => {
      const pQuery = prepareQuery('fiv words long');
      const { score } = wordSearch(pQuery, 'I am Five Words Long');
      expect(score).toBe(6);
    });
    it('should return all matches in matches prop', () => {
      const pQuery = prepareQuery('fiv words long');
      const { matches } = wordSearch(pQuery, 'I am Five Words Long');
      expect(matches).toEqual([
        [5, 8],
        [10, 15],
        [16, 20],
      ]);
    });
    it('should only match keywords in correct order', () => {
      const pQuery = prepareQuery('two one three');
      const { matches } = wordSearch(pQuery, 'one two three four five');
      expect(matches).toEqual([[4, 7]]);
    });

    it('should match a whole string', () => {
      const pQuery = prepareQuery('i am five words long');
      const { score } = wordSearch(pQuery, 'I am Five Words Long');
      expect(score).toBe(8);
    });

    it('should match multiple starts of words', () => {
      const pQuery = prepareQuery('ho co yo n lo thi');
      const { score } = wordSearch(pQuery, 'how could you not love this??');
      expect(score).toBe(7);
    });

    it('should match only part of a query and input', () => {
      const pQuery = prepareQuery('pa query bu no te');
      const { score } = wordSearch(pQuery, 'I match only part of the query');
      expect(score).toBe(3);
    });
  });
});
