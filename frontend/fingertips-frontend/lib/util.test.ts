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

    it('should return false if propName is valid but incorrectly camelCased', () => {
      const result = shouldForwardProp('bgColor', 'some target');
      expect(result).toBe(false);
    });

    it('should return false if propName is valid but correctly cased', () => {
      const result = shouldForwardProp('bgcolor', 'some target');
      expect(result).toBe(false);
    });
  });
});
