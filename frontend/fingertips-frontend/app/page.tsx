import { HomePage } from '@/components/pages/home';
import {
  Configuration,
  WeatherForecastApi,
} from '@/generated-sources/api-client/src';
import { connection } from 'next/server';

export default async function Home() {
  await connection();

  const config: Configuration = new Configuration({
    basePath: process.env.FINGERTIPS_API_URL,
  });

  const forecastApi = new WeatherForecastApi(config);
  const forecasts = await forecastApi.getWeatherForecast();

  return <HomePage forecasts={forecasts} />;
}
