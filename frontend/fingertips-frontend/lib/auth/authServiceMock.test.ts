import { AuthServiceMock } from './authServiceMock';

describe('auth service mock', () => {
  it('should default to returning a null session (logged out)', async () => {
    const mockAuthService = new AuthServiceMock();

    const session = await mockAuthService.auth();

    expect(session).toBeNull();
  });

  it('should return a session populated with a username after logging in', async () => {
    const mockAuthService = new AuthServiceMock();

    await mockAuthService.signIn();
    const session = await mockAuthService.auth();

    expect(session).not.toBeNull();
    expect(session?.user?.name).not.toBeUndefined();
  });

  it('should return a session expiring at a given time after logging in', async () => {
    const now = new Date(Date.now());
    const mockAuthService = new AuthServiceMock(now);

    await mockAuthService.signIn();
    const session = await mockAuthService.auth();

    expect(session).not.toBeNull();
    expect(session?.expires).toEqual(now.toISOString());
  });

  it('should return a null session after logging out', async () => {
    const mockAuthService = new AuthServiceMock();

    await mockAuthService.signIn();
    const loggedInSession = await mockAuthService.auth();

    expect(loggedInSession).not.toBeNull();

    await mockAuthService.signOut();
    const loggedOutSession = await mockAuthService.auth();

    expect(loggedOutSession).toBeNull();
  });
});
