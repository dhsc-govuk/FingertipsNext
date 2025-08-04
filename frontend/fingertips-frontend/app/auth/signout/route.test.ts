/**
 * @vitest-environment node
 */
// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth } from '@/mock/utils/mockAuth';
import { mockRedirect } from '@/mock/utils/mockNextNavigation';
//
import { signOutHandler } from '@/lib/auth/handlers';
import { GET } from '@/app/auth/signout/route';
import {
  FTA_SIGNOUT_REDIRECT_PARAM,
  getLogoutEndpoint,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { Mock } from 'vitest';
import { mockSession } from '@/mock/utils/mockAuth';
import { getFingertipsFrontendURL } from '@/lib/urlHelper';

vi.mock('@/lib/auth/handlers', () => {
  return {
    signOutHandler: vi.fn(),
  };
});

vi.mock('@/lib/auth/providers/fingertipsAuthProvider', async () => {
  const originalModule = await vi.importActual(
    '@/lib/auth/providers/fingertipsAuthProvider'
  );

  return {
    ...originalModule,
    getLogoutEndpoint: vi.fn(),
  };
});

vi.mock('@/lib/urlHelper', () => {
  return {
    getFingertipsFrontendURL: vi.fn(),
  };
});

const fingertipsFrontendURL = 'https://some-external-url.foobar/';
(getFingertipsFrontendURL as Mock).mockReturnValue(fingertipsFrontendURL);

beforeEach(vi.clearAllMocks);

describe('sign out route handler', () => {
  it('should call the sign out handler if session present', async () => {
    mockAuth.mockResolvedValue(mockSession());

    await GET();

    expect(signOutHandler).toHaveBeenCalled();
  });

  it('should redirect to origin if logout endpoint not set', async () => {
    mockAuth.mockResolvedValue(undefined);
    (getLogoutEndpoint as Mock).mockReturnValue(undefined);

    await GET();

    expect(mockRedirect).toHaveBeenCalledWith(fingertipsFrontendURL);
  });

  it('should redirect to logout url if logout endpoint set', async () => {
    mockAuth.mockResolvedValue(undefined);
    const logoutEndpoint = 'https://some-external-url.foobar/';
    (getLogoutEndpoint as Mock).mockReturnValue(logoutEndpoint);
    const expectedLogoutURL = `${logoutEndpoint}?${FTA_SIGNOUT_REDIRECT_PARAM}=${fingertipsFrontendURL}`;

    await GET();

    expect(mockRedirect).toHaveBeenCalledWith(expectedLogoutURL);
  });
});
