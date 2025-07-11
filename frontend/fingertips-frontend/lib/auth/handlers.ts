'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthProvidersFactory } from '@/lib/auth/providers/providerFactory';

export async function signInHandler() {
  const providers = AuthProvidersFactory.getProviders();
  if (providers.length === 0) {
    return;
  }

  if (providers.length > 1) {
    return await signIn();
  }

  return await signIn(providers[0].id as string);
}

export async function signOutHandler() {
  return await signOut();
}
