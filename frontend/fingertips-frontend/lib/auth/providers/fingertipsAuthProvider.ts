// FingertipsAuthProvider is a generic OIDC provider
// with the aud and scope embedding stage added to the auth flow

import { FTA_PROVIDER_ID } from '@/lib/auth/providers';
import { tryReadEnvVar } from '@/lib/envUtils';
import { OIDCConfig } from 'next-auth/providers';

export interface FingertipsProfile {
  aud: string;
}

interface FTAProviderConfig {
  clientId: string;
  clientSecret: string;
  issuer: string;
  logout: string;
}

export function getFTAProviderConfig(): FTAProviderConfig | undefined {
  const clientId = tryReadEnvVar('AUTH_CLIENT_ID');
  const clientSecret = tryReadEnvVar('AUTH_CLIENT_SECRET');
  const issuer = tryReadEnvVar('AUTH_ISSUER');
  const logout = tryReadEnvVar('AUTH_LOGOUT');

  return clientId && clientSecret && issuer && logout
    ? { clientId, clientSecret, issuer, logout }
    : undefined;
}

export const FingertipsAuthProvider = ({
  clientId,
  clientSecret,
  issuer,
}: FTAProviderConfig): OIDCConfig<FingertipsProfile> => ({
  id: FTA_PROVIDER_ID,
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

export function getLogoutEndpoint() {
  return getFTAProviderConfig()?.logout;
}
