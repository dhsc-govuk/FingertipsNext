'use server';

import { getAuthProvider, signIn, signOut } from '@/lib/authService/auth';

export async function signInHandler() {
  const provider = getAuthProvider();
  if (!provider) {
    return;
  }

  if (provider === 'Mock') {
    return await signIn('credentials');
  }

  if (provider === 'Entra') {
    return await signIn('microsoft-entra-id');
  }

  return await signIn();
}

export async function signOutHandler() {
  return await signOut();
}
