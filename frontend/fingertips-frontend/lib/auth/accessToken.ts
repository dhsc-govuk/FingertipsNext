'use server';

import { auth } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

export const getAuthHeader = async (): Promise<HeadersInit | undefined> => {
  const accessToken = await getAccessToken();

  if (!accessToken) return undefined;

  return { Authorization: `bearer ${accessToken}` };
};

const getAccessToken = async () => {
  const session = await auth();
  if (!session) {
    return undefined;
  }

  const jwt = await getJWT();

  return jwt?.accessToken;
};

const getJWT = async () => {
  const req = {
    headers: Object.fromEntries(await headers()),
    cookies: Object.fromEntries(
      (await cookies()).getAll().map((c) => [c.name, c.value])
    ),
  };

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  return token;
};
