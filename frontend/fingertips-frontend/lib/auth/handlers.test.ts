import { signIn, signOut } from '@/lib/auth';
import { signInHandler, signOutHandler } from '@/lib/auth/handlers';
import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';

vi.mock('@/lib/auth', () => {
  return {
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock('@lib/auth/config');
const mockGetProviders = vi.fn();
AuthProvidersFactory.getProviders = mockGetProviders;

beforeEach(vi.clearAllMocks);

describe('sign in handler', () => {
  it('should not call sign in no provider is returned', async () => {
    mockGetProviders.mockReturnValue([]);

    await signInHandler();

    expect(signIn).not.toHaveBeenCalled();
  });

  it('should call sign in with no parameters if provider is "Multiple"', async () => {
    mockGetProviders.mockReturnValue([{}, {}]);

    await signInHandler();

    expect(signIn).toHaveBeenCalledWith();
  });

  it('should call sign in with the provider id if single provider is given', async () => {
    mockGetProviders.mockReturnValue([{ id: 'foobar' }]);

    await signInHandler();

    expect(signIn).toHaveBeenCalledWith('foobar');
  });
});

describe('sign out handler', () => {
  it('should call sign out', async () => {
    await signOutHandler();

    expect(signOut).toHaveBeenCalled();
  });
});
