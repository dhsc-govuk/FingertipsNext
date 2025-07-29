import { auth } from '@/lib/auth';
import { signOutHandler } from '@/lib/auth/handlers';
import {
  buildLogoutURLWithRedirect,
  getLogoutEndpoint,
} from '@/lib/auth/providers/fingertipsAuthProvider';
import { getFingertipsFrontendURL } from '@/lib/urlHelper';
import { redirect } from 'next/navigation';

export async function GET() {
  const session = await auth();

  if (session) {
    return await signOutHandler();
  }

  const redirectTo = getFingertipsFrontendURL().toString();
  const logoutEndpoint = getLogoutEndpoint();
  if (!logoutEndpoint) {
    return redirect(redirectTo);
  }

  const logoutURL = buildLogoutURLWithRedirect(logoutEndpoint, redirectTo);

  return redirect(logoutURL);
}
