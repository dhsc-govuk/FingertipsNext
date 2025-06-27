import { mockAuthFunction, mockUser } from '@/lib/auth/providers/mockProvider';

describe('mock auth', () => {
  it('should return the test user when given the password password', () => {
    expect(mockAuthFunction({ password: 'password' })).toEqual(mockUser);
  });

  it('should throw an error if the given password does not equal password', () => {
    expect(() => mockAuthFunction({ password: 'hunter2' })).toThrow();
  });
});
