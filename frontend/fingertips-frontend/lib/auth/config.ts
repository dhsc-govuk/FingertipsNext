import {
  FingertipsAuthProvider,
  FingertipsProfile,
  getFTAProviderConfig,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { MockAuthProvider } from '@/lib/auth/providers/mockProvider';
import { CredentialsConfig, OIDCConfig } from 'next-auth/providers';

export class AuthProvidersFactory {
  private static providers:
    | (CredentialsConfig | OIDCConfig<FingertipsProfile>)[]
    | null;

  public static getProviders() {
    if (!this.providers) {
      this.providers = this.buildProviders();
    }
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

    if (
      process.env.NODE_ENV === 'development' &&
      process.env.AUTH_USE_MOCK === 'true'
    ) {
      providers.push(MockAuthProvider);
    }

    return providers;
  }
}
