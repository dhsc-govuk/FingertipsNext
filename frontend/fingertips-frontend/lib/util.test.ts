import { expect } from '@jest/globals';
import { getEnvironmentVariable } from './utils';

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
