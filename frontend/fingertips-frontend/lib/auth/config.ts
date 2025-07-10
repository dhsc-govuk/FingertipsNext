import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';
import { validateAccessToken } from '@/lib/auth/validation';
import { NextAuthConfig } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}

export function buildAuthConfig(): NextAuthConfig {
  if (!process.env.AUTH_SECRET) {
    throw new Error('AUTH_SECRET not found in environment');
  }

  const config: NextAuthConfig = {
    providers: AuthProvidersFactory.getProviders(),
    callbacks: {
      jwt: async ({ token, user: _, account }) => {
        if (account && account.access_token) {
          if (await validateAccessToken(account.access_token)) {
            return { ...token, accessToken: account?.access_token };
          }
        }
        return token;
      },

      session: ({ session, token }) => {
        session.accessToken = token.accessToken;

        return session;
      },
    },
  };

  return config;
}
