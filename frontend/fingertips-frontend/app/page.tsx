import { HomePage } from '@/components/pages/home';
import { WeatherForecastApi } from '@/generated-sources/openapi/src';
import { connection } from 'next/server';

export default async function Home() {
  await connection();

  const forecastApi = new WeatherForecastApi();
  const forecasts = await forecastApi.getWeatherForecast();

  if (forecasts.length > 0) {
    return <HomePage forecasts={forecasts} />;
  }
}
