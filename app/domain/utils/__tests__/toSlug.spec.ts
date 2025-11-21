import { describe, expect, it } from 'vitest';
import { toSlug } from '../toSlug';

describe('toSlug', () => {
  it('should convert chars to lowercase', () => {
    expect(toSlug('HeLlOWoRLD')).toBe('helloworld');
  });

  it('should convert (multiple) spaces to (single) dashes', () => {
    expect(toSlug('hello    world')).toBe('hello-world');
  });

  it('should stash multiple dashes', () => {
    expect(toSlug('hello - ; world')).toBe('hello-world');
  });

  it('should trim whitespace and dashes at start and end', () => {
    expect(toSlug(' - more ; - ')).toBe('more');
  });

  it('should convert umlauts to their replacements', () => {
    expect(toSlug('Mädchen müssen Möwen mögen')).toBe('maedchen-muessen-moewen-moegen');
  });

  it('should convert special chars to their specified replacements', () => {
    expect(toSlug('àáâèéëêìíïîòóôùúûñç·/_,:;')).toBe('aaaeeeeiiiiooouuunc');
  });
});
