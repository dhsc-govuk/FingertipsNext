import {
  FingertipsAuthProvider,
  getFTAProviderConfig,
} from '@/lib/auth/providers/fingertipsAuthProvider';

describe('get fingertips auth config', () => {
  it('should return undefined if client id is missing', () => {
    vi.stubEnv('AUTH_CLIENT_ID', undefined);
    vi.stubEnv('AUTH_CLIENT_SECRET', 'there');
    vi.stubEnv('AUTH_ISSUER', 'there');
    vi.stubEnv('AUTH_WELLKNOWN', 'there');

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return undefined if client secret is missing', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'there');
    vi.stubEnv('AUTH_CLIENT_SECRET', undefined);
    vi.stubEnv('AUTH_ISSUER', 'there');
    vi.stubEnv('AUTH_WELLKNOWN', 'there');

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return undefined if issuer is missing', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'there');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'there');
    vi.stubEnv('AUTH_ISSUER', undefined);
    vi.stubEnv('AUTH_WELLKNOWN', 'there');

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return undefined if wellknown is missing', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'there');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'there');
    vi.stubEnv('AUTH_ISSUER', 'there');
    vi.stubEnv('AUTH_WELLKNOWN', undefined);

    expect(getFTAProviderConfig()).toBeUndefined();
  });

  it('should return correct env var in correct place if all present', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'clientid');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'secret');
    vi.stubEnv('AUTH_ISSUER', 'issuer');
    vi.stubEnv('AUTH_WELLKNOWN', 'wellknown');

    const config = getFTAProviderConfig();
    expect(config).not.toBeUndefined();
    expect(config).toEqual({
      clientId: 'clientid',
      clientSecret: 'secret',
      issuer: 'issuer',
      wellKnown: 'wellknown',
    });
  });
});

describe('build fingertips auth provider', () => {
  it('should populate the provider with correct fields', () => {
    vi.stubEnv('AUTH_CLIENT_ID', 'id');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'secret');
    vi.stubEnv('AUTH_ISSUER', 'issuer');
    vi.stubEnv('AUTH_WELLKNOWN', 'wellknown');

    const provider = FingertipsAuthProvider(getFTAProviderConfig()!);

    expect(provider.clientId).toEqual('id');
    expect(provider.clientSecret).toEqual('secret');
    expect(provider.issuer).toEqual('issuer');
    expect(provider.wellKnown).toEqual(`wellknown`);
  });
});
