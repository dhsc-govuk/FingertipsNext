'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthConfigFactory } from '@/lib/auth/config';

export async function signInHandler() {
  const provider = AuthConfigFactory.getProvider();
  if (!provider) {
    return;
  }

  if (provider === 'Mock') {
    return await signIn('credentials');
  }

  if (provider === 'FTA') {
    return await signIn('fta');
  }

  return await signIn();
}

export async function signOutHandler() {
  return await signOut();
}
