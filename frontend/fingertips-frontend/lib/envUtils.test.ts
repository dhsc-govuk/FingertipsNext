import { readEnvVar, tryReadEnvVar } from './envUtils';

describe('Validate Environment Variable Utils', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('Should get Env Var ', () => {
    process.env.SOME_ENV_VAR = 'someValue';
    expect(readEnvVar('SOME_ENV_VAR')).toEqual('someValue');
  });

  it('Should throw exception if env Var not present', () => {
    expect(() => readEnvVar('SOME_ENV_VAR')).toThrow(
      "Env var 'SOME_ENV_VAR' needs to be defined"
    );
  });

  it('Should accept empty string', () => {
    process.env.SOME_ENV_VAR = '';
    expect(readEnvVar('SOME_ENV_VAR')).toEqual('');
  });

  it('tryGetEnv should not throw exception ', () => {
    expect(tryReadEnvVar('SOME_ENV_VAR')).toEqual(undefined);
  });
});
