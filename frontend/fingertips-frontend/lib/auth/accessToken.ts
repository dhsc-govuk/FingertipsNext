'use server';

import { auth } from '@/lib/auth';
import { usingSecureCookies } from '@/lib/auth/config';
import { getJWT } from '@/lib/auth/getJWT';

export const getAuthHeader = async () => {
  const accessToken = await getAccessToken();

  if (!accessToken) return undefined;

  return { Authorization: `bearer ${accessToken}` };
};

export const getAccessToken = async () => {
  const session = await auth();
  if (!session) {
    return undefined;
  }

  const jwt = await getJWT(usingSecureCookies());

  return jwt?.accessToken;
};
