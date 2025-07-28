import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';
import { tryReadEnvVar } from '@/lib/envUtils';
import { NextAuthConfig } from 'next-auth';
import 'next-auth/jwt';

export class AuthConfigFactory {
  private static config: NextAuthConfig | null;

  public static getConfig() {
    if (!tryReadEnvVar('AUTH_SECRET')) {
      // This can happen either because AUTH_SECRET is not set
      // or during build when nextjs can't read the runtime env
      // if it matters, authjs will log an error
      return {
        providers: [],
      };
    }

    this.config ??= this.buildConfig();

    return this.config;
  }

  private static buildConfig() {
    const config: NextAuthConfig = {
      useSecureCookies: false, // REQUIRED FOR SELF-CERT
      providers: AuthProvidersFactory.getProviders(),
      callbacks: {
        jwt: async ({ token, user, account }) => {
          if (!account?.access_token) return token;
          // this callback gets invoked on both the node and edge runtime,
          // but the state where account is present (signin)
          // only happens on the node runtime
          // BUT
          // nextjs still complains that the user api code isn't built for the edge runtime
          // even if it will never be called
          if (process.env.NEXT_RUNTIME === 'nodejs') {
            const { validateUser } = await import('@/lib/auth/validation');

            if (await validateUser(account.access_token)) {
              return {
                ...token,
                accessToken: account.access_token,
                provider: account.provider,
              };
            } else {
              console.log(`failed to validate user ${user.id}`);
            }
          }
          return { ...token, provider: account.provider };
        },

        session({ session, token }) {
          session.provider = token.provider;
          return session;
        },
      },
    };

    return config;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    provider: string;
  }
}

declare module 'next-auth' {
  interface Session {
    provider: string;
  }
}
