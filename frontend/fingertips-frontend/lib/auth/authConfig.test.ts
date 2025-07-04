import { buildAuthConfig } from '@/lib/auth/config';

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
