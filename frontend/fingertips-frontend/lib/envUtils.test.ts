import { readEnvVar, tryReadEnvVar } from './envUtils';
import EnvironmentVariables from '@/EnvironmentVariables';

describe('Validate Environment Variable Utils', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('Should get Env Var', () => {
    process.env.SOME_ENV_VAR = 'someValue';
    expect(readEnvVar('SOME_ENV_VAR' as EnvironmentVariables)).toEqual(
      'someValue'
    );
  });

  it('Should throw exception if env Var not present', () => {
    expect(() => readEnvVar('SOME_ENV_VAR' as EnvironmentVariables)).toThrow(
      "Env var 'SOME_ENV_VAR' needs to be defined"
    );
  });

  it('Should accept empty string', () => {
    process.env.SOME_ENV_VAR = '';
    expect(readEnvVar('SOME_ENV_VAR' as EnvironmentVariables)).toEqual('');
  });

  it('tryGetEnv should not throw exception', () => {
    expect(tryReadEnvVar('SOME_ENV_VAR' as EnvironmentVariables)).toEqual(
      undefined
    );
  });
});
