/**
 * @vitest-environment node
 */
// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth } from '@/mock/utils/mockAuth';
import { mockRedirect } from '@/mock/utils/mockNextNavigation';
//
import { signOutHandler } from '@/lib/auth/handlers';
import { Session } from 'next-auth';
import { GET } from '@/app/auth/signout/[[...redirect]]/route';
import { NextRequest } from 'next/server';
import { getLogoutEndpoint } from '@/lib/auth/providers/fingertipsAuthProvider';
import { Mock } from 'vitest';

vi.mock('@/lib/auth/handlers', () => {
  return {
    signOutHandler: vi.fn(),
  };
});

vi.mock('@/lib/auth/providers/fingertipsAuthProvider', () => {
  return {
    getLogoutEndpoint: vi.fn(),
  };
});

const baseURL = 'http://localhost:3000';
const req = new NextRequest(baseURL);
const session: Session = {
  expires: 'some time',
  provider: 'some provider',
};

beforeEach(vi.clearAllMocks);

describe('sign out route handler', () => {
  it('should call the sign out handler with redirect if session and returnto present', async () => {
    mockAuth.mockResolvedValue(session);

    const redirect = `${baseURL}/some/route`;

    await GET(req, { params: Promise.resolve({ redirect }) });

    expect(signOutHandler).toHaveBeenCalledWith(redirect);
  });

  it('should call the sign out handler with base route if session present and returnto not set', async () => {
    mockAuth.mockResolvedValue(session);

    await GET(req, { params: Promise.resolve({}) });

    expect(signOutHandler).toHaveBeenCalledWith(baseURL);
  });

  it('should redirect to returnto if logout endpoint not set', async () => {
    mockAuth.mockResolvedValue(undefined);
    (getLogoutEndpoint as Mock).mockResolvedValue(undefined);

    const redirect = `${baseURL}/some/route`;

    await GET(req, { params: Promise.resolve({ redirect }) });

    expect(mockRedirect).toHaveBeenCalledWith(redirect);
  });
});
