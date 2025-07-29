import { getFingertipsFrontendURL } from '@/lib/urlHelper';

describe('get fingertips frontend url', () => {
  it('should return FINGERTIPS_FRONTEND_URL if set', () => {
    const fingertipsURL = 'https://some-url.foobar/';
    vi.stubEnv('FINGERTIPS_FRONTEND_URL', 'https://some-url.foobar/');

    expect(getFingertipsFrontendURL()).toEqual(new URL(fingertipsURL));
  });

  it('should return localhost if FINGERTIPS_FRONTEND_URL not set', () => {
    vi.stubEnv('FINGERTIPS_FRONTEND_URL', undefined);

    expect(getFingertipsFrontendURL()).toEqual(
      new URL('http://localhost:3000/')
    );
  });
});
