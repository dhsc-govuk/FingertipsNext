import { auth } from '@/lib/auth';
import { signOutHandler } from '@/lib/auth/handlers';
import { getLogoutEndpoint } from '@/lib/auth/providers/fingertipsAuthProvider';
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
    redirect(redirectTo);
  }

  redirect(`${logoutEndpoint}?post_logout_redirect_uri=${redirectTo}`);
}
