import {
  FingertipsAuthProvider,
  FingertipsProfile,
  getFTAProviderConfig,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { MockAuthProvider } from '@/lib/auth/providers/mockProvider';
import { tryReadEnvVar } from '@/lib/envUtils';
import { CredentialsConfig, OIDCConfig } from 'next-auth/providers';

export class AuthProvidersFactory {
  private static providers:
    | (CredentialsConfig | OIDCConfig<FingertipsProfile>)[]
    | null;

  public static getProviders() {
    this.providers ??= this.buildProviders();

    return this.providers;
  }

  public static reset() {
    this.providers = null;
  }

  private static buildProviders() {
    const providers = [];

    const ftaProviderConfig = getFTAProviderConfig();
    if (ftaProviderConfig) {
      providers.push(FingertipsAuthProvider(ftaProviderConfig));
    }

    if (tryReadEnvVar('AUTH_USE_PASSWORD_MOCK') === 'true') {
      providers.push(MockAuthProvider);
    }

    return providers;
  }
}
