import Credentials from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers';

export const MockAuthProvider: Provider = Credentials({
  id: 'password',
  name: 'password',
  credentials: { password: { label: 'Password', type: 'password' } },
  authorize: (credentials) => {
    if (credentials.password === 'password') {
      return {
        email: 'testUser@example.com',
        name: 'testUser',
        id: 'test-user',
        image: '',
      };
    }

    throw new Error();
  },
});
