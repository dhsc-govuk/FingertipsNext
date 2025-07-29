import { tryReadEnvVar } from '@/lib/envUtils';

export function getFingertipsFrontendURL(): URL {
  const url =
    tryReadEnvVar('FINGERTIPS_FRONTEND_URL') ?? 'http://localhost:3000/';

  return new URL(url);
}
