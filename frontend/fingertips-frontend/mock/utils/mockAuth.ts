import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const mockAuth = vi.fn();
export const mockSignIn = vi.fn();
export const mockSignOut = vi.fn();

vi.mock('@/lib/auth', () => {
  return {
    auth: mockAuth,
    signIn: mockSignIn,
    signOut: mockSignOut,
  };
});

export const mockSession = (overrides?: Partial<Session>): Session => {
  return {
    expires: 'some time',
    provider: 'some provider',
    ...overrides,
  };
};

export const mockJWT = (overrides?: Partial<JWT>): JWT => {
  return {
    accessToken: 'hunter2',
    provider: 'some provider',
    ...overrides,
  };
};
