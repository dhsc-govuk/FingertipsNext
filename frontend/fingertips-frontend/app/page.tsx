import { HomePage } from '@/components/pages/home';
import {
  Configuration,
  WeatherForecastApi,
} from '@/generated-sources/api-client';

import { connection } from 'next/server';
import { trace, context } from '@opentelemetry/api';

export default async function Home() {
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
  const forecasts = await forecastApi.getWeatherForecast();

  console.log(
    `traceId: ${trace.getSpan(context.active())?.spanContext().traceId}`
  );

  return <HomePage forecasts={forecasts} />;
}
