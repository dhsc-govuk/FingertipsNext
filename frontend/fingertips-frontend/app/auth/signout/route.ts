import { auth } from '@/lib/auth';
import { signOutHandler } from '@/lib/auth/handlers';
import {
  FTA_SIGNOUT_REDIRECT_PARAM,
  getLogoutEndpoint,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.origin;
  const session = await auth();

  if (session) {
    return await signOutHandler();
  }

  const logoutEndpoint = getLogoutEndpoint();

  if (!logoutEndpoint) {
    return redirect(redirectTo);
  }

  const logoutURL = new URL(logoutEndpoint);
  logoutURL.searchParams.append(FTA_SIGNOUT_REDIRECT_PARAM, redirectTo);

  return redirect(logoutURL.toString());
}
