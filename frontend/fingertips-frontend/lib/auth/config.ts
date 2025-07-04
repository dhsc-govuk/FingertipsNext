import { UserInfoType } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';
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

  if (!process.env.AUTH_SECRET) {
    // this will be removed when auth is integrated and AUTH_SECRET is provided from build
    // for now it is here to keep e2e and ui tests from breaking
    console.log('WARNING - AUTH_SECRET NOT PROVIDED');
    config.secret = 'insecure';
  }

  return config;
}

const validateAccessToken = async (accessToken: string): Promise<boolean> => {
  const userResponse = await getUser(accessToken);
  if (userResponse) {
    console.log(`JH userId: ${userResponse.externalId}`);
    return true;
  }
  console.log(`JH invalid access token`);
  return false;
};

async function getUser(accessToken: string) {
  const userApi = ApiClientFactory.getUserApiClient();
  let userInfoResponse: UserInfoType;

  try {
    userInfoResponse = await userApi.getUserInfo({
      headers: { Authorization: `bearer ${accessToken}` },
    });
  } catch (error) {
    // JH TODO
    console.log(error);
    return undefined;
  }

  return userInfoResponse;
}
