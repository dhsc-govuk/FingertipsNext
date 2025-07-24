// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth, mockSignIn, mockSignOut } from '@/mock/utils/mockAuth';
//
import { signInHandler, signOutHandler } from '@/lib/auth/handlers';
import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';
import { Session } from 'next-auth';
import {
  FTA_PROVIDER_ID,
  MOCK_PASSWORD_PROVIDER_ID,
} from '@/lib/auth/providers';

vi.mock('@/lib/auth/config');
const mockGetProviders = vi.fn();
AuthProvidersFactory.getProviders = mockGetProviders;

beforeEach(vi.clearAllMocks);

describe('sign in handler', () => {
  it('should not call sign in no provider is returned', async () => {
    mockGetProviders.mockReturnValue([]);

    await signInHandler();

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('should call sign in with no parameters if provider is "Multiple"', async () => {
    mockGetProviders.mockReturnValue([{}, {}]);

    await signInHandler();

    expect(mockSignIn).toHaveBeenCalledWith();
  });

  it('should call sign in with the provider id if single provider is given', async () => {
    mockGetProviders.mockReturnValue([{ id: 'foobar' }]);

    await signInHandler();

    expect(mockSignIn).toHaveBeenCalledWith('foobar');
  });
});

const sessionWithMockPasswordProvider: Session = {
  expires: 'some time',
  provider: MOCK_PASSWORD_PROVIDER_ID,
};

const sessionWithFTAProvider: Session = {
  expires: 'some time',
  provider: FTA_PROVIDER_ID,
};

describe('sign out handler', () => {
  mockAuth.mockResolvedValue(sessionWithMockPasswordProvider);
  it('should call sign out with no redirect if session provider is not set to fta provider', async () => {
    await signOutHandler('some redirect');

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should call sign out with redirect if session provider is set to fta provider', async () => {
    mockAuth.mockResolvedValue(sessionWithFTAProvider);
    const expectedEndSession = 'https://end-session-base-url.bar';

    vi.stubEnv('AUTH_LOGOUT', expectedEndSession);

    await signOutHandler('some redirect');

    expect(mockSignOut).toHaveBeenCalledWith({
      redirectTo: '/auth/signout/some%20redirect',
    });
  });

  // it('should populate redirect uri with redirect if provided to handler', async () => {
  //   mockAuth.mockResolvedValue(sessionWithFTAProvider);
  //   const expectedEndSession = 'https://end-session-base-url.bar';
  //   const expectedRedirect = 'charts/some?query=string%and=123';

  //   vi.stubEnv('AUTH_LOGOUT', expectedEndSession);

  //   await signOutHandler(expectedRedirect);

  //   expect(mockSignOut).not.toHaveBeenCalled();
  //   expect(mockRedirect).toHaveBeenCalledWith(
  //     'https://end-session-base-url.bar?post_logout_redirect_uri=http://fingertips-url.foo/signout/charts/some?query=string%and=123'
  //   );
  // });
});
