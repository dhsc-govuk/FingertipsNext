'use server';

import { signIn, signOut } from './auth';

export async function signInHandler() {
  await signIn();
}

export async function signOutHandler() {
  await signOut();
}
