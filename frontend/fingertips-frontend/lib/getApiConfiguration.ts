import { Configuration } from '@/generated-sources/ft-api-client';


export function getApiConfiguration(): Configuration {
  const apiUrl = process.env.FINGERTIPS_API_URL;

  if (!apiUrl) {
    throw new Error(
      'No API URL set. Have you set the FINGERTIPS_API_URL environment variable?'
    );
  }

  const config: Configuration = new Configuration({
    basePath: apiUrl,
  });

  return config;
}
