import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'password',
      name: 'password',
      credentials: { password: { label: 'Password', type: 'password' } },
      authorize: (credentials) => {
        if (credentials.password === 'password') {
          return { email: 'testUser@example.com', name: 'testUser', image: '' };
        }

        throw new Error();
      },
    }),
  ],
});
