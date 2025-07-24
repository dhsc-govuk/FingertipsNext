// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth, mockSignIn, mockSignOut } from '@/mock/utils/mockAuth';
//
import { signInHandler, signOutHandler } from '@/lib/auth/handlers';
import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';
import {
  FTA_PROVIDER_ID,
  MOCK_PASSWORD_PROVIDER_ID,
} from '@/lib/auth/providers';
import { mockSession } from '@/mock/utils/mockAuth';

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

describe('sign out handler', () => {
  mockAuth.mockResolvedValue(
    mockSession({ provider: MOCK_PASSWORD_PROVIDER_ID })
  );
  it('should call sign out with no redirect if session provider is not set to fta provider', async () => {
    await signOutHandler('some redirect');

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should call sign out with redirect if session provider is set to fta provider', async () => {
    mockAuth.mockResolvedValue(mockSession({ provider: FTA_PROVIDER_ID }));
    const expectedEndSession = 'https://end-session-base-url.bar';

    vi.stubEnv('AUTH_LOGOUT', expectedEndSession);

    await signOutHandler('some redirect');

    expect(mockSignOut).toHaveBeenCalledWith({
      redirectTo: '/auth/signout/some%20redirect',
    });
  });
});
