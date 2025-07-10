import { buildAuthConfig } from '@/lib/auth/config';

describe('build config', () => {
  it('should not throw an error if auth secret is set on env', () => {
    vi.stubEnv('AUTH_SECRET', 'hunter2');

    expect(() => buildAuthConfig()).not.toThrow();
  });

  it('should throw an error if auth secret is not set on env', () => {
    vi.stubEnv('AUTH_SECRET', undefined);

    expect(() => buildAuthConfig()).toThrow();
  });
});
