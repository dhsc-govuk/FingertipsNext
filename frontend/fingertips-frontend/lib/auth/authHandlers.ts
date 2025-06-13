'use server';

import { signIn, signOut } from '@/auth';
import { Session } from 'next-auth';

export interface Auth {
  session: Session | null;
  signInHandler: () => Promise<void>;
  signOutHandler: () => Promise<void>;
}

export async function signInHandler() {
  await signIn();
}

export async function signOutHandler() {
  await signOut();
}
