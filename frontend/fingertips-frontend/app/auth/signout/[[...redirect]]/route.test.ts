/**
 * @vitest-environment node
 */
// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth } from '@/mock/utils/mockAuth';
import { mockRedirect } from '@/mock/utils/mockNextNavigation';
//
import { signOutHandler } from '@/lib/auth/handlers';
import { GET } from '@/app/auth/signout/[[...redirect]]/route';
import { NextRequest } from 'next/server';
import {
  FTA_SIGNOUT_REDIRECT_PARAM,
  getLogoutEndpoint,
} from '@/lib/auth/providers/fingertipsAuthProvider';
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
    getLogoutEndpoint: vi.fn(),
  };
});

const baseURL = 'http://localhost:3000';
const req = new NextRequest(baseURL);

beforeEach(vi.clearAllMocks);

describe('sign out route handler', () => {
  it('should call the sign out handler with redirect if session and returnto present', async () => {
    mockAuth.mockResolvedValue(mockSession());

    const redirect = `${baseURL}/some/route`;

    await GET(req, { params: Promise.resolve({ redirect }) });

    expect(signOutHandler).toHaveBeenCalledWith(redirect);
  });

  it('should call the sign out handler with base route if session present and returnto not set', async () => {
    mockAuth.mockResolvedValue(mockSession());

    await GET(req, { params: Promise.resolve({}) });

    expect(signOutHandler).toHaveBeenCalledWith(baseURL);
  });

  it('should redirect to returnto if logout endpoint not set', async () => {
    mockAuth.mockResolvedValue(undefined);
    (getLogoutEndpoint as Mock).mockReturnValue(undefined);

    const redirectTo = `${baseURL}/some/route`;

    await GET(req, { params: Promise.resolve({ redirect: redirectTo }) });

    expect(mockRedirect).toHaveBeenCalledWith(redirectTo);
  });

  it('should redirect to returnto if logout endpoint set', async () => {
    mockAuth.mockResolvedValue(undefined);
    const expectedLogoutEndpoint = 'https://some-external-url.foobar';
    (getLogoutEndpoint as Mock).mockReturnValue(expectedLogoutEndpoint);

    const redirectTo = `${baseURL}/some/route`;
    const expectedResult = new URL(expectedLogoutEndpoint);
    expectedResult.searchParams.append(FTA_SIGNOUT_REDIRECT_PARAM, redirectTo);

    await GET(req, { params: Promise.resolve({ redirect: redirectTo }) });

    expect(mockRedirect).toHaveBeenCalledWith(expectedResult.toString());
  });
});
