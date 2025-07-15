import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';

describe('build auth providers', () => {
  beforeEach(() => {
    vi.stubEnv('AUTH_USE_PASSWORD_MOCK', undefined);
    vi.stubEnv('AUTH_CLIENT_ID', undefined);
    vi.stubEnv('AUTH_CLIENT_SECRET', undefined);
    vi.stubEnv('AUTH_ISSUER', undefined);
    vi.stubEnv('AUTH_WELLKNOWN', undefined);

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
    vi.stubEnv('AUTH_CLIENT_ID', 'foo');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'bar');
    vi.stubEnv('AUTH_ISSUER', 'baz');
    vi.stubEnv('AUTH_WELLKNOWN', 'alsobaz');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(1);
    expect(AuthProvidersFactory.getProviders()[0].id).toEqual('fta');
  });

  it('should return config with two providers with id "fta" if auth env vars set and AUTH_USE_PASSWORD_MOCK set', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('AUTH_USE_PASSWORD_MOCK', 'true');
    vi.stubEnv('AUTH_CLIENT_ID', 'foo');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'bar');
    vi.stubEnv('AUTH_ISSUER', 'baz');
    vi.stubEnv('AUTH_WELLKNOWN', 'alsobaz');

    expect(AuthProvidersFactory.getProviders()).toHaveLength(2);
  });
});
