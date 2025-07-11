import {
  FingertipsAuthProvider,
  getFTAProviderConfig,
} from '@/lib/auth/providers/fingertipsAuthProvider';

describe('get fingertips auth config', () => {
  it('should return undefined if client id is missing', () => {
    vi.stubEnv('AUTH_FTA_ID', undefined);
    vi.stubEnv('AUTH_FTA_SECRET', 'there');
    vi.stubEnv('AUTH_FTA_ISSUER', 'there');

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return undefined if client secret is missing', () => {
    vi.stubEnv('AUTH_FTA_ID', 'there');
    vi.stubEnv('AUTH_FTA_SECRET', undefined);
    vi.stubEnv('AUTH_FTA_ISSUER', 'there');

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return undefined if issuer is missing', () => {
    vi.stubEnv('AUTH_FTA_ID', 'there');
    vi.stubEnv('AUTH_FTA_SECRET', 'there');
    vi.stubEnv('AUTH_FTA_ISSUER', undefined);

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return correct env var in correct place if all present', () => {
    vi.stubEnv('AUTH_FTA_ID', 'id');
    vi.stubEnv('AUTH_FTA_SECRET', 'secret');
    vi.stubEnv('AUTH_FTA_ISSUER', 'issuer');

    const config = getFTAProviderConfig();
    expect(config).not.toBeUndefined();
    expect(config).toEqual({
      clientId: 'id',
      clientSecret: 'secret',
      issuer: 'issuer',
    });
  });
});

describe('build fingertips auth provider', () => {
  it('should use correct env vars for correct fields', () => {
    vi.stubEnv('AUTH_FTA_ID', 'id');
    vi.stubEnv('AUTH_FTA_SECRET', 'secret');
    vi.stubEnv('AUTH_FTA_ISSUER', 'issuer');

    const provider = FingertipsAuthProvider(getFTAProviderConfig()!);

    expect(provider.clientId).toEqual('id');
    expect(provider.clientSecret).toEqual('secret');
    expect(provider.issuer).toEqual('issuer');
  });
});
