// FingertipsAuthProvider is a generic OIDC provider
// with the aud and scope embedding stage added to the auth flow

import { OIDCConfig } from 'next-auth/providers';

export interface FingertipsProfile {
  aud: string;
}

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
}: FTAProviderConfig): OIDCConfig<FingertipsProfile> => ({
  id: 'fta',
  name: 'FTA',
  type: 'oidc',
  issuer: issuer,
  clientId: clientId,
  clientSecret: clientSecret,
  authorization: {
    params: {
      scope: `api://${clientId}/.default openid`,
    },
  },
});
