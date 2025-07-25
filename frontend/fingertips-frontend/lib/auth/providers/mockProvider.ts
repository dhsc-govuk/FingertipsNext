import { MOCK_PROVIDER_ID } from '@/lib/auth/providers';
import Credentials from 'next-auth/providers/credentials';

export const mockUser = {
  email: 'testUser@example.com',
  name: 'testUser',
  id: 'test-user',
  image: '',
};

export const mockAuthFunction = (
  credentials: Partial<Record<'password', unknown>>
) => {
  if (credentials.password === 'password') {
    return mockUser;
  }

  throw new Error();
};

export const MockAuthProvider = Credentials({
  id: MOCK_PROVIDER_ID,
  name: 'password',
  credentials: { password: { label: 'Password', type: 'password' } },
  authorize: mockAuthFunction,
});
