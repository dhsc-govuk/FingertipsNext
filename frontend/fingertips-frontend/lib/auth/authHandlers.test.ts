import { signIn, signOut } from '@/lib/auth';
import { signInHandler, signOutHandler } from '@/lib/auth/handlers';
import { AuthConfigFactory } from '@/lib/auth/config';

vi.mock('@/lib/auth', () => {
  return {
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock('@lib/auth/config');
const mockGetProvider = vi.fn();
AuthConfigFactory.getProvider = mockGetProvider;

beforeEach(vi.clearAllMocks);

describe('sign in handler', () => {
  it('should not call sign in if provider is undefined', async () => {
    mockGetProvider.mockReturnValue(undefined);

    await signInHandler();

    expect(signIn).not.toHaveBeenCalled();
  });

  it('should call sign in with parameter "fta" if provider is "FTA"', async () => {
    mockGetProvider.mockReturnValue('FTA');

    await signInHandler();

    expect(signIn).toHaveBeenCalledWith('fta');
  });

  it('should call sign in with parameter "credentials" if provider is "Mock"', async () => {
    mockGetProvider.mockReturnValue('Mock');

    await signInHandler();

    expect(signIn).toHaveBeenCalledWith('credentials');
  });

  it('should call sign in with no parameters if provider is "Multiple"', async () => {
    mockGetProvider.mockReturnValue('Multiple');

    await signInHandler();

    expect(signIn).toHaveBeenCalledWith();
  });
});

describe('sign out handler', () => {
  it('should call sign out', async () => {
    await signOutHandler();

    expect(signOut).toHaveBeenCalled();
  });
});
