import { Session } from 'next-auth';
import { IAuthService } from './authTypes';

export class NoOpAuthService implements IAuthService {
  public async signIn() {
    console.log('sign in');
    return;
  }

  public async signOut() {
    console.log('sign out');
    return;
  }
  public async auth(): Promise<Session | null> {
    return null;
  }
}
