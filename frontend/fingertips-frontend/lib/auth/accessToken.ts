'use server';

import { auth } from '@/lib/auth';
import { getJWT } from '@/lib/auth/getJWT';
import { randomUUID } from 'crypto';

export const getAuthHeader = async () => {
  const accessToken = await getAccessToken();

  if (!accessToken) return undefined;

  return { Authorization: `bearer ${accessToken}` };
};

export const getAccessToken = async () => {
  const uuid = randomUUID();
  console.log(`[${uuid}] JH ACCESSING TOKEN`);
  const session = await auth();
  if (!session) {
    console.log(`[${uuid}] JH NO SESSION`);
    return undefined;
  }

  const jwt = await getJWT();

  if (jwt) {
    console.log(`[${uuid}] JH JWT FOUND`);
  } else {
    console.log(`[${uuid}] JH NOT JWT FOUND`);
  }

  return jwt?.accessToken;
};
