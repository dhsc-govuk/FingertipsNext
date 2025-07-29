'use server';

import { auth, signIn, signOut } from '@/lib/auth';
import { FTA_PROVIDER_ID } from '@/lib/auth/providers';
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
  const session = await auth();

  if (session?.provider === FTA_PROVIDER_ID) {
    return signOut({
      redirectTo: `/auth/signout`,
    });
  }

  return signOut();
}
