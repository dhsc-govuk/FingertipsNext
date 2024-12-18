import {
  Configuration,
  WeatherForecast,
  WeatherForecastApi,
} from '@/generated-sources/api-client';
import { connection } from 'next/server';

export async function fetchData(): Promise<WeatherForecast[]> {
  // We don't want to render this page statically
  await connection();

  const apiUrl = process.env.FINGERTIPS_API_URL;

  if (!apiUrl) {
    throw new Error(
      'No API URL set. Have you set the FINGERTIPS_API_URL environment variable?'
    );
  }

  const config: Configuration = new Configuration({
    basePath: apiUrl,
  });

  const forecastApi = new WeatherForecastApi(config);
  return await forecastApi.getWeatherForecast();
}
