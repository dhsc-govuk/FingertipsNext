import { AuthProvidersFactory } from '@/lib/auth/config';

describe('build auth providers', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_USE_MOCK', undefined);
    vi.stubEnv('AUTH_OIDC_CLIENT_ID', undefined);
    vi.stubEnv('AUTH_OIDC_CLIENT_SECRET', undefined);
    vi.stubEnv('AUTH_OIDC_ISSUER', undefined);

    AuthProvidersFactory.reset();
  });

  it('should return config with zero providers if no env set', () => {
    expect(AuthProvidersFactory.getProviders()).toHaveLength(0);
  });

  it('should return config with one provider with id "credentials" if AUTH_USE_MOCK set and NODE_ENV equals development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_USE_MOCK', 'true');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(1);
    expect(AuthProvidersFactory.getProviders()[0].id).toEqual('credentials');
  });

  it('should return config with zero providers if AUTH_USE_MOCK set and NODE_ENV equals production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('AUTH_USE_MOCK', 'true');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(0);
  });

  it('should return config with one provider with id "fta" if auth env vars set', () => {
    vi.stubEnv('AUTH_OIDC_CLIENT_ID', 'foo');
    vi.stubEnv('AUTH_OIDC_CLIENT_SECRET', 'bar');
    vi.stubEnv('AUTH_OIDC_ISSUER', 'baz');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(1);
    expect(AuthProvidersFactory.getProviders()[0].id).toEqual('fta');
  });

  it('should return config with one provider with id "fta" if auth env vars set and AUTH_USE_MOCK set and NOVE_ENV equals production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('AUTH_USE_MOCK', 'true');
    vi.stubEnv('AUTH_OIDC_CLIENT_ID', 'foo');
    vi.stubEnv('AUTH_OIDC_CLIENT_SECRET', 'bar');
    vi.stubEnv('AUTH_OIDC_ISSUER', 'baz');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(1);
    expect(AuthProvidersFactory.getProviders()[0].id).toEqual('fta');
  });

  it('should return config with two providers if auth env vars set and AUTH_USE_MOCK set and NOVE_ENV equals development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_USE_MOCK', 'true');
    vi.stubEnv('AUTH_OIDC_CLIENT_ID', 'foo');
    vi.stubEnv('AUTH_OIDC_CLIENT_SECRET', 'bar');
    vi.stubEnv('AUTH_OIDC_ISSUER', 'baz');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(2);
  });
});
