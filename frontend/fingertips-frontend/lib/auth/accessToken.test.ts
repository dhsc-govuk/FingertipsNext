// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth } from '@/mock/utils/mockAuth';
//
import { getAccessToken } from '@/lib/auth/accessToken';
import { getJWT } from '@/lib/auth/getJWT';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Mock } from 'vitest';

vi.mock('@/lib/auth/getJWT', () => {
  return { getJWT: vi.fn() };
});

const mockGetJWT = getJWT as Mock;

const validJWT: JWT = { accessToken: 'hunter2' };
const validSession: Session = { expires: 'some time' };

describe('get access token', () => {
  it('should return the access token on a JWT if a session exists and a JWT with a valid access token is found', async () => {
    mockAuth.mockResolvedValue(validSession);
    mockGetJWT.mockResolvedValue(validJWT);

    const result = await getAccessToken();

    expect(result).toBe(validJWT.accessToken);
  });

  it("should return no access token a session doesn't exist", async () => {
    mockAuth.mockResolvedValue(null);
    mockGetJWT.mockResolvedValue(validJWT);

    const result = await getAccessToken();

    expect(result).toBeUndefined();
  });

  it('should return no access token if JWT not found', async () => {
    mockAuth.mockResolvedValue(validSession);
    mockGetJWT.mockResolvedValue(null);

    const result = await getAccessToken();

    expect(result).toBeUndefined();
  });

  it('should return no access token if access token not on JWT', async () => {
    mockAuth.mockResolvedValue(validSession);
    mockGetJWT.mockResolvedValue(null);

    const result = await getAccessToken();

    expect(result).toBeUndefined();
  });
});
