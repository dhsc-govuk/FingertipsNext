import { usingSecureCookies } from '@/lib/auth/config';

describe('usingSecureCookies', () => {
  it('should return false if AUTH_URL is not set', () => {
    vi.stubEnv('AUTH_URL', undefined);

    expect(usingSecureCookies()).toBe(false);
  });

  it('should return false if AUTH_URL does not begin with https', () => {
    vi.stubEnv('AUTH_URL', 'http://example.com');

    expect(usingSecureCookies()).toBe(false);
  });

  it('should return true if AUTH_URL begins with https', () => {
    vi.stubEnv('AUTH_URL', 'https://example.com');

    expect(usingSecureCookies()).toBe(true);
  });
});
