// FingertipsAuthProvider is a generic OIDC provider
// with the aud and scope embedding stage added to the auth flow

import { readEnvVar } from '@/lib/envUtils';
import { OIDCConfig } from 'next-auth/providers';

export interface FingertipsProfile {
  aud: string;
}

interface FTAProviderConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

export function getFTAProviderConfig(): FTAProviderConfig | undefined {
  const clientId = readEnvVar('AUTH_CLIENT_ID');
  const clientSecret = readEnvVar('AUTH_CLIENT_SECRET');
  const tenantId = readEnvVar('AUTH_TENANT_ID');

  return clientId && clientSecret && tenantId
    ? { clientId, clientSecret, tenantId }
    : undefined;
}

export const FingertipsAuthProvider = ({
  clientId,
  clientSecret,
  tenantId,
}: FTAProviderConfig): OIDCConfig<FingertipsProfile> => ({
  id: 'fta',
  name: 'FTA',
  type: 'oidc',
  issuer: `https://${tenantId}.ciamlogin.com/${tenantId}/v2.0`,
  clientId: clientId,
  clientSecret: clientSecret,
  wellKnown: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
  authorization: {
    params: {
      scope: `api://${clientId}/.default openid`,
    },
  },
});
