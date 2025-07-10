import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';
import { tryReadEnvVar } from '@/lib/envUtils';
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

export class AuthConfigFactory {
  private static config: NextAuthConfig | null;

  public static getConfig() {
    if (!tryReadEnvVar('AUTH_SECRET')) {
      // This can happen either because AUTH_SECRET is not set
      // or during build when nextjs can't read the runtime env
      console.log('WARNING - AUTH_SECRET NOT IN ENV');
      return {
        providers: [],
      };
    }

    this.config ??= this.buildConfig();

    return this.config;
  }

  private static buildConfig() {
    const config: NextAuthConfig = {
      providers: AuthProvidersFactory.getProviders(),
      callbacks: {
        jwt: async ({ token, user: _, account }) => {
          if (account?.access_token) {
            // this callback gets invoked on both the node and edge runtime,
            // but the state where account is present (signin)
            // only happens on the node runtime
            // BUT
            // nextjs still complains that the user api code isn't built for the edge runtime
            // even if it will never be called
            if (process.env.NEXT_RUNTIME === 'nodejs') {
              const { validateAccessToken } = await import(
                '@/lib/auth/validation'
              );

              if (await validateAccessToken(account.access_token)) {
                return { ...token, accessToken: account?.access_token };
              }
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
}
