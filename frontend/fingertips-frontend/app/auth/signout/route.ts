import { auth } from '@/lib/auth';
import { signOutHandler } from '@/lib/auth/handlers';
import {
  buildLogoutURLWithRedirect,
  getLogoutEndpoint,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (session) {
    return await signOutHandler();
  }

  const redirectTo = request.nextUrl.origin;
  const logoutEndpoint = getLogoutEndpoint();
  if (!logoutEndpoint) {
    return redirect(redirectTo);
  }

  const logoutURL = buildLogoutURLWithRedirect(logoutEndpoint, redirectTo);

  return redirect(logoutURL);
}
