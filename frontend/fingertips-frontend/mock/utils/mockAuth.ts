export const mockAuth = vi.fn();
export const mockSignIn = vi.fn();
export const mockSignOut = vi.fn();

vi.mock('@/lib/auth', () => {
  return {
    auth: mockAuth,
    signIn: mockSignIn,
    signOut: mockSignOut,
  };
});
