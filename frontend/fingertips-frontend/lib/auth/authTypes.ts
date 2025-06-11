import { Session } from 'next-auth';

export interface IAuthService {
  signIn(): void;
  signOut(): void;
  auth(): Promise<Session | null>;
}
