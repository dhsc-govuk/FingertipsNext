import { usingSecureCookies } from '@/lib/auth/config';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

export const getJWT = async () => {
  const req = {
    headers: Object.fromEntries(await headers()),
    cookies: Object.fromEntries(
      (await cookies()).getAll().map((c) => [c.name, c.value])
    ),
  };

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: usingSecureCookies(), // getToken recognises NEXTAUTH_URL but doesn't recognise AUTH_URL so we need to do our own check
  });

  return token;
};
