'use server';

import { auth } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

export const addTokenToHeaders = async (
  headers: HeadersInit = {}
): Promise<HeadersInit> => {
  const session = await auth();
  if (!session) {
    return headers;
  }

  const jwt = await getJwt();

  return { ...headers, Authorization: `bearer ${jwt?.accessToken}` };
};

const getJwt = async () => {
  const req = {
    headers: Object.fromEntries(await headers()),
    cookies: Object.fromEntries(
      (await cookies()).getAll().map((c) => [c.name, c.value])
    ),
  };

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  return token;
};
