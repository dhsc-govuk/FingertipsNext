import { Session } from 'next-auth';
import { IAuthService } from './authTypes';

const defaultUser = 'Mock User';
const defaultExpiry = new Date('January 1, 1900').toISOString();

export class AuthServiceMock implements IAuthService {
  private session: Session | null = null;
  private expiry = defaultExpiry;

  constructor(expiry?: Date) {
    if (expiry) this.expiry = expiry.toISOString();
  }

  public async signIn() {
    this.session = {
      user: {
        name: defaultUser,
      },
      expires: this.expiry,
    };
  }

  public async signOut() {
    this.session = null;
  }
  public async auth(): Promise<Session | null> {
    return this.session;
  }
}
