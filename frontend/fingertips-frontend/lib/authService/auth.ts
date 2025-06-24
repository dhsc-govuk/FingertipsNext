import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

type AuthProvider = 'Entra' | 'Mock' | 'Multiple' | undefined;

let authProvider: AuthProvider = undefined;

export const getAuthProvider = () => {
  console.log(authProvider);
  return authProvider;
};

const credentialsProvider = Credentials({
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

interface EntraConfig {
  clientId: string;
  clientSecret: string;
  issuer: string;
}

const getAzureConfiguration = (): EntraConfig | undefined => {
  const clientId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID;
  const clientSecret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET;
  const issuer = process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER;

  return clientId && clientSecret && issuer
    ? { clientId, clientSecret, issuer }
    : undefined;
};

const buildAzureProvider = ({
  clientId,
  clientSecret,
  issuer,
}: EntraConfig) => {
  return MicrosoftEntraID({
    clientId: clientId,
    clientSecret: clientSecret,
    issuer: issuer,
  });
};

const buildProviders = () => {
  const providers = [];
  const entraConfig = getAzureConfiguration();
  if (entraConfig) {
    authProvider = 'Entra';
    providers.push(buildAzureProvider(entraConfig));
  }

  if (
    process.env.NODE_ENV === 'development' &&
    process.env.MOCK_AUTH === 'true'
  ) {
    if (!authProvider) {
      authProvider = 'Mock';
    } else {
      authProvider = 'Multiple';
    }

    providers.push(credentialsProvider);
  }

  return providers;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: buildProviders(),
});
