import { AuthProvidersFactory, buildAuthConfig } from '@/lib/auth/config';

describe('build auth providers', () => {
  beforeEach(() => {
    vi.stubEnv('AUTH_USE_PASSWORD_MOCK', undefined);
    vi.stubEnv('AUTH_FTA_ID', undefined);
    vi.stubEnv('AUTH_FTA_SECRET', undefined);
    vi.stubEnv('AUTH_FTA_ISSUER', undefined);

    AuthProvidersFactory.reset();
  });

  it('should return config with zero providers if no env vars set', () => {
    expect(AuthProvidersFactory.getProviders()).toHaveLength(0);
  });

  it('should return config with one provider with id "credentials" if AUTH_USE_PASSWORD_MOCK set', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_USE_PASSWORD_MOCK', 'true');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(1);
    expect(AuthProvidersFactory.getProviders()[0].id).toEqual('credentials');
  });

  it('should return config with one provider with id "fta" if auth env vars set', () => {
    vi.stubEnv('AUTH_FTA_ID', 'foo');
    vi.stubEnv('AUTH_FTA_SECRET', 'bar');
    vi.stubEnv('AUTH_FTA_ISSUER', 'baz');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(1);
    expect(AuthProvidersFactory.getProviders()[0].id).toEqual('fta');
  });

  it('should return config with two providers with id "fta" if auth env vars set and AUTH_USE_PASSWORD_MOCK set', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('AUTH_USE_PASSWORD_MOCK', 'true');
    vi.stubEnv('AUTH_FTA_ID', 'foo');
    vi.stubEnv('AUTH_FTA_SECRET', 'bar');
    vi.stubEnv('AUTH_FTA_ISSUER', 'baz');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(2);
  });
});

describe('build config', () => {
  it('should not populate the secret field if auth secret is set on env', () => {
    vi.stubEnv('AUTH_SECRET', 'foobar');

    const config = buildAuthConfig();

    expect(config.secret).toBeUndefined();
  });

  it('should populate the secret field and log a warning if auth secret is not set on env', () => {
    vi.stubEnv('AUTH_SECRET', undefined);

    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {});

    const config = buildAuthConfig();

    expect(config.secret).not.toBeUndefined();
    expect(consoleMock).toHaveBeenCalled();
  });
});
