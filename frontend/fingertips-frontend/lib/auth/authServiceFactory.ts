import { AuthServiceMock } from './authServiceMock';
import { IAuthService } from './authTypes';

export class AuthServiceFactory {
  private static authServiceInstance: IAuthService | null;

  private static buildAuthServiceMock() {
    return new AuthServiceMock();
  }

  private static buildAuthService(): IAuthService {
    return this.buildAuthServiceMock();
  }

  public static getAuthService(): IAuthService {
    if (!this.authServiceInstance) {
      this.authServiceInstance = this.buildAuthService();
    }

    return this.authServiceInstance;
  }
}
