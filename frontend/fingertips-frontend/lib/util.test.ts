import { expect } from '@jest/globals';
import { shouldForwardProp, getEnvironmentVariable } from './utils';

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

    it('should return true if propName is valid but correctly camelCased', () => {
      const result = shouldForwardProp('cellSpacing', 'some target');
      expect(result).toBe(true);
    });
  });
});

describe('getEnvironmentVariable', () => {
  describe('if the environment is not configured', () => {
    it('should throw an error on reading the missing environment variable', () => {
      expect(() => {
        getEnvironmentVariable('MISSING_ENVIRONMENT_VARIABLE');
      }).toThrow(Error);
    });

    it('should return void on reading the missing environment variable when default behaviour overridden', () => {
      const value = getEnvironmentVariable(
        'MISSING_ENVIRONMENT_VARIABLE',
        false
      );
      expect(value).toBe(void 0);
    });
  });

  describe('if the environment is configured', () => {
    process.env.CONFIGURED_ENVIRONMENT_VARIABLE = 'test-value';
    it('should return the value of the environment variable', () => {
      const value = getEnvironmentVariable('CONFIGURED_ENVIRONMENT_VARIABLE');
      expect(value).toBe('test-value');
    });
  });
});
