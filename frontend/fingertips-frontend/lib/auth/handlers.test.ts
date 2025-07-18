// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockSignIn, mockSignOut } from '@/mock/utils/mockAuth';
//
import { signInHandler, signOutHandler } from '@/lib/auth/handlers';
import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';

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
  it('should call sign out', async () => {
    await signOutHandler();

    expect(mockSignOut).toHaveBeenCalled();
  });
});
