/**
 * @vitest-environment node
 */
// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth } from '@/mock/utils/mockAuth';
import { mockRedirect } from '@/mock/utils/mockNextNavigation';
//
import { signOutHandler } from '@/lib/auth/handlers';
import { GET } from '@/app/auth/signout/route';
import { NextRequest } from 'next/server';
import { buildLogoutURLWithRedirect } from '@/lib/auth/providers/fingertipsAuthProvider';
import { Mock } from 'vitest';
import { mockSession } from '@/mock/utils/mockAuth';

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
    buildLogoutURLWithRedirect: vi.fn(),
  };
});

const origin = 'http://localhost:3000';
const authEndpoint = '/auth/signout';
const reqURL = new URL(origin + authEndpoint);

const req = new NextRequest(reqURL);

beforeEach(vi.clearAllMocks);

describe('sign out route handler', () => {
  it('should call the sign out handler if session present', async () => {
    mockAuth.mockResolvedValue(mockSession());

    await GET(req);

    expect(signOutHandler).toHaveBeenCalled();
  });

  it('should redirect to origin if logout endpoint not set', async () => {
    mockAuth.mockResolvedValue(undefined);
    (buildLogoutURLWithRedirect as Mock).mockReturnValue(undefined);

    await GET(req);

    expect(mockRedirect).toHaveBeenCalledWith(origin);
  });

  it('should redirect to logout url if logout endpoint set', async () => {
    mockAuth.mockResolvedValue(undefined);
    const expectedLogoutEndpoint = 'https://some-external-url.foobar/';
    (buildLogoutURLWithRedirect as Mock).mockReturnValue(
      expectedLogoutEndpoint
    );

    await GET(req);

    expect(mockRedirect).toHaveBeenCalledWith(expectedLogoutEndpoint);
  });
});
