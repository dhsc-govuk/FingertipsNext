import NextAuth from 'next-auth';
import { AuthServiceMock, mockAuthProvider } from './authServiceMock';
import { IAuthService } from './authTypes';
import { NoOpAuthService } from './noOpAuthService';

// a few placeholders to keep any auth changes out of sight while WIP

export class AuthServiceFactory {
  private static authServiceInstance: IAuthService | null;

  private static buildAuthServiceMock() {
    return new AuthServiceMock();
  }

  private static buildAuthService(): IAuthService {
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.MOCK_AUTH === 'true'
    ) {
      console.log('using mock credentials');
      return NextAuth({ providers: [mockAuthProvider] });
    }

    console.log('using noop');
    return new NoOpAuthService();
  }

  public static getAuthService(): IAuthService {
    if (!this.authServiceInstance) {
      this.authServiceInstance = this.buildAuthService();
    }

    return this.authServiceInstance;
  }
}
