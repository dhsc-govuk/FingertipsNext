// FingertipsAuthProvider is a generic OIDC provider
// with the aud and scope embedding stage added to the auth flow

import { tryReadEnvVar } from '@/lib/envUtils';
import { OIDCConfig } from 'next-auth/providers';

export interface FingertipsProfile {
  aud: string;
}

interface FTAProviderConfig {
  clientId: string;
  clientSecret: string;
  issuer: string;
  wellKnown: string;
}

export function getFTAProviderConfig(): FTAProviderConfig | undefined {
  const clientId = tryReadEnvVar('AUTH_CLIENT_ID');
  const clientSecret = tryReadEnvVar('AUTH_CLIENT_SECRET');
  const issuer = tryReadEnvVar('AUTH_ISSUER');
  const wellKnown = tryReadEnvVar('AUTH_WELLKNOWN');

  return clientId && clientSecret && issuer && wellKnown
    ? { clientId, clientSecret, issuer, wellKnown }
    : undefined;
}

export const FingertipsAuthProvider = ({
  clientId,
  clientSecret,
  issuer,
  wellKnown,
}: FTAProviderConfig): OIDCConfig<FingertipsProfile> => ({
  id: 'fta',
  name: 'FTA',
  type: 'oidc',
  issuer: issuer,
  clientId: clientId,
  clientSecret: clientSecret,
  checks: ['none'],
  wellKnown: wellKnown,
  authorization: {
    params: {
      scope: `api://${clientId}/.default openid`,
    },
  },
});
