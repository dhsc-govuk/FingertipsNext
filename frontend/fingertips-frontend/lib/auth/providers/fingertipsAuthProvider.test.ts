import {
  FingertipsAuthProvider,
  getFTAProviderConfig,
  getLogoutEndpoint,
} from '@/lib/auth/providers/fingertipsAuthProvider';

describe('get fingertips auth config', () => {
  it('should return undefined if client id is missing', () => {
    vi.stubEnv('AUTH_CLIENT_ID', undefined);
    vi.stubEnv('AUTH_CLIENT_SECRET', 'there');
    vi.stubEnv('AUTH_ISSUER', 'there');
    vi.stubEnv('AUTH_LOGOUT', 'there');

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return undefined if client secret is missing', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'there');
    vi.stubEnv('AUTH_CLIENT_SECRET', undefined);
    vi.stubEnv('AUTH_ISSUER', 'there');
    vi.stubEnv('AUTH_LOGOUT', 'there');

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return undefined if issuer is missing', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'there');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'there');
    vi.stubEnv('AUTH_ISSUER', undefined);
    vi.stubEnv('AUTH_LOGOUT', 'there');

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return undefined if logout is missing', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'there');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'there');
    vi.stubEnv('AUTH_ISSUER', 'there');
    vi.stubEnv('AUTH_LOGOUT', undefined);

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return correct env var in correct place if all present', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'clientid');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'secret');
    vi.stubEnv('AUTH_ISSUER', 'issuer');
    vi.stubEnv('AUTH_LOGOUT', 'logout');

    const config = getFTAProviderConfig();
    expect(config).not.toBeUndefined();
    expect(config).toEqual({
      clientId: 'clientid',
      clientSecret: 'secret',
      issuer: 'issuer',
      logout: 'logout',
    });
  });
});

describe('build fingertips auth provider', () => {
  it('should populate the provider with correct fields', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'id');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'secret');
    vi.stubEnv('AUTH_ISSUER', 'issuer');
    vi.stubEnv('AUTH_LOGOUT', 'logout');

    const provider = FingertipsAuthProvider(getFTAProviderConfig()!);

    expect(provider.clientId).toEqual('id');
    expect(provider.clientSecret).toEqual('secret');
    expect(provider.issuer).toEqual('issuer');
  });
});

describe('get auth logout endpoint', () => {
  it('should return the logout endpoint if all auth env vars present', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'id');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'secret');
    vi.stubEnv('AUTH_ISSUER', 'issuer');
    vi.stubEnv('AUTH_LOGOUT', 'logout');

    expect(getLogoutEndpoint()).toEqual('logout');
  });
});
