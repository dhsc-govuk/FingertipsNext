import { expect } from '@jest/globals';
import { shouldForwardProp } from './utils';

describe('shouldForwardProp', () => {
  describe('when target is not type string', () => {
    it('should return true regardless if propName is valid', () => {
      const result = shouldForwardProp('invalidProp', 123);
      expect(result).toBe(true);
    });
  });

  describe('when target is type string', () => {
    it('should return false if propName is not valid', () => {
      const result = shouldForwardProp('invalidProp', 'some target');
      expect(result).toBe(false);
    });

    it('should return true if propName is valid', () => {
      const result = shouldForwardProp('href', 'some target');
      expect(result).toBe(true);
    });

    it('should return false if propName is valid but incorrectly cased', () => {
      const result = shouldForwardProp('cellspacing', 'some target');
      expect(result).toBe(false);
    });

    it('should return false if propName is valid but correctly camelCased', () => {
      const result = shouldForwardProp('cellSpacing', 'some target');
      expect(result).toBe(true);
    });
  });
});
