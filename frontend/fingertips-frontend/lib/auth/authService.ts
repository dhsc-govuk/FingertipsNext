import NextAuth, { NextAuthResult, Session } from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { IAuthService } from './authTypes';

export class AuthService implements IAuthService {
  private readonly authInstance: NextAuthResult;

  constructor(entraIdId: string, entraIdSecret: string, entraIdIssuer: string) {
    this.authInstance = NextAuth({
      providers: [
        MicrosoftEntraID({
          clientId: entraIdId,
          clientSecret: entraIdSecret,
          issuer: entraIdIssuer,
        }),
      ],
    });
  }

  async signIn() {
    await this.authInstance.signIn();
  }
  async signOut() {
    await this.authInstance.signOut();
  }
  async auth(): Promise<Session | null> {
    return await this.authInstance.auth();
  }
}
