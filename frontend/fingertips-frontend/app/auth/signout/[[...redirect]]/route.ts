import { auth } from '@/lib/auth';
import { signOutHandler } from '@/lib/auth/handlers';
import {
  FTA_SIGNOUT_REDIRECT_PARAM,
  getLogoutEndpoint,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ redirect?: string }>;
  }
) {
  const { redirect: redirectTo = request.nextUrl.origin } = await params;
  const session = await auth();

  if (session) {
    return await signOutHandler(redirectTo);
  }

  const logoutEndpoint = getLogoutEndpoint();

  if (!logoutEndpoint) {
    return redirect(redirectTo);
  }

  const logoutURL = new URL(logoutEndpoint);
  logoutURL.searchParams.append(FTA_SIGNOUT_REDIRECT_PARAM, redirectTo);

  return redirect(logoutURL.toString());
}
