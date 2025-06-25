import {
  FingertipsAuthProvider,
  getFTAProviderConfig,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { MockAuthProvider } from '@/lib/auth/providers/mockProvider';
import { NextAuthConfig } from 'next-auth';

export type AuthProvider = 'FTA' | 'Mock' | 'Multiple' | undefined;

export class AuthConfigFactory {
  private static _authState: {
    authConfig: NextAuthConfig;
    authProvider: AuthProvider;
  } | null = null;

  private static authState() {
    if (!this._authState) {
      this._authState = this.buildAuthConfig();
    }

    return this._authState;
  }

  public static getProvider() {
    return this.authState().authProvider;
  }

  public static getConfig() {
    return this.authState().authConfig;
  }

  public static reset() {
    this._authState = null;
  }

  private static buildAuthConfig(): {
    authConfig: NextAuthConfig;
    authProvider: AuthProvider;
  } {
    const providers = [];
    let authProvider: AuthProvider = undefined;

    const ftaProviderConfig = getFTAProviderConfig();

    if (ftaProviderConfig) {
      authProvider = 'FTA';
      providers.push(FingertipsAuthProvider(ftaProviderConfig));
    }

    if (
      process.env.NODE_ENV === 'development' &&
      process.env.AUTH_USE_MOCK === 'true'
    ) {
      if (!authProvider) {
        authProvider = 'Mock';
      } else {
        authProvider = 'Multiple';
      }

      providers.push(MockAuthProvider);
    }

    const authConfig = {
      providers: providers,

      debug: process.env.AUTH_DEBUG === 'true',
    };

    return { authConfig, authProvider };
  }
}
