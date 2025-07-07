import {
  FingertipsAuthProvider,
  FingertipsProfile,
  getFTAProviderConfig,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { MockAuthProvider } from '@/lib/auth/providers/mockProvider';
import { NextAuthConfig } from 'next-auth';
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

    if (process.env.AUTH_USE_PASSWORD_MOCK === 'true') {
      providers.push(MockAuthProvider);
    }

    return providers;
  }
}

export function buildAuthConfig(): NextAuthConfig {
  const config: NextAuthConfig = {
    providers: AuthProvidersFactory.getProviders(),
  };

  if (!process.env.AUTH_SECRET) {
    // this will be removed when auth is integrated and AUTH_SECRET is provided from build
    // for now it is here to keep e2e and ui tests from breaking
    console.log('WARNING - AUTH_SECRET NOT PROVIDED');
    config.secret = 'insecure';
  }

  return config;
}
