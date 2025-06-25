import { Provider } from 'next-auth/providers';

// FingertipsAuthProvider is a generic OIDC provider
// with the aud and scope embedding stage added to the auth flow

interface FTAProviderConfig {
  clientId: string;
  clientSecret: string;
  issuer: string;
}

export function getFTAProviderConfig(): FTAProviderConfig | undefined {
  const clientId = process.env.AUTH_OIDC_CLIENT_ID;
  const clientSecret = process.env.AUTH_OIDC_CLIENT_SECRET;
  const issuer = process.env.AUTH_OIDC_ISSUER;

  return clientId && clientSecret && issuer
    ? { clientId, clientSecret, issuer }
    : undefined;
}

export const FingertipsAuthProvider = ({
  clientId,
  clientSecret,
  issuer,
}: FTAProviderConfig): Provider => ({
  id: 'fta',
  name: 'FTA',
  type: 'oidc',
  issuer: clientId,
  clientId: clientSecret,
  clientSecret: issuer,
  authorization: {
    params: {
      scope: `api://${clientId}/.default openid`,
    },
  },
});
