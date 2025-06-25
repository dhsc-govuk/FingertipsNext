import { AuthConfigFactory } from '@/lib/auth/config';

describe('build auth providers', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_USE_MOCK', undefined);
    vi.stubEnv('AUTH_OIDC_CLIENT_ID', undefined);
    vi.stubEnv('AUTH_OIDC_CLIENT_SECRET', undefined);
    vi.stubEnv('AUTH_OIDC_ISSUER', undefined);

    AuthConfigFactory.reset();
  });

  it('should return config with zero providers and auth provider of "none" if no env set', () => {
    expect(AuthConfigFactory.getConfig().providers).toHaveLength(0);
    expect(AuthConfigFactory.getProvider()).toBeUndefined();
  });

  it('should return config with one provider and auth provider of "Mock" if AUTH_USE_MOCK set and NODE_ENV equals development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_USE_MOCK', 'true');

    expect(AuthConfigFactory.getConfig().providers).toHaveLength(1);
    expect(AuthConfigFactory.getProvider()).toEqual('Mock');
  });

  it('should return config with zero providers and auth provider of "None" if AUTH_USE_MOCK set and NODE_ENV equals production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('AUTH_USE_MOCK', 'true');

    expect(AuthConfigFactory.getConfig().providers).toHaveLength(0);
    expect(AuthConfigFactory.getProvider()).toBeUndefined();
  });

  it('should return config with one provider and auth provider of "FTA" if auth env vars set', () => {
    vi.stubEnv('AUTH_OIDC_CLIENT_ID', 'foo');
    vi.stubEnv('AUTH_OIDC_CLIENT_SECRET', 'bar');
    vi.stubEnv('AUTH_OIDC_ISSUER', 'baz');

    expect(AuthConfigFactory.getConfig().providers).toHaveLength(1);
    expect(AuthConfigFactory.getProvider()).toEqual('FTA');
  });

  it('should return config with one provider and auth provider of "FTA" if auth env vars set and AUTH_USE_MOCK set and NOVE_ENV equals production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('AUTH_USE_MOCK', 'true');
    vi.stubEnv('AUTH_OIDC_CLIENT_ID', 'foo');
    vi.stubEnv('AUTH_OIDC_CLIENT_SECRET', 'bar');
    vi.stubEnv('AUTH_OIDC_ISSUER', 'baz');

    expect(AuthConfigFactory.getConfig().providers).toHaveLength(1);
    expect(AuthConfigFactory.getProvider()).toEqual('FTA');
  });

  it('should return config with two providers and auth provider of "Multiple" if auth env vars set and AUTH_USE_MOCK set and NOVE_ENV equals development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_USE_MOCK', 'true');
    vi.stubEnv('AUTH_OIDC_CLIENT_ID', 'foo');
    vi.stubEnv('AUTH_OIDC_CLIENT_SECRET', 'bar');
    vi.stubEnv('AUTH_OIDC_ISSUER', 'baz');

    expect(AuthConfigFactory.getConfig().providers).toHaveLength(2);
    expect(AuthConfigFactory.getProvider()).toEqual('Multiple');
  });
});
