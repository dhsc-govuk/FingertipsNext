import { HomePage } from '@/components/pages/home';
import { IndicatorsApi } from '@/generated-sources/openapi/dist';
import { connection } from 'next/server';

export type Forecast = {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
};

export default async function Home() {
  // We don't want to render this page statically
  await connection();

  const apiUrl = process.env.FINGERTIPS_API_URL;

  if (!apiUrl) {
    throw new Error(
      'No API URL set. Have you set the FINGERTIPS_API_URL environment variable?'
    );
  }

  const indicatorApi = new IndicatorsApi();
  const indicator = await indicatorApi.getIndicator({ indicatorId: 123 });
  console.log(`indicator definition ${indicator.definition}`);

  const weatherData = await fetch(apiUrl, {
    // Cache the data for 60s
    next: { revalidate: 60 },
  });
  const forecasts: Forecast[] = await weatherData.json();

  return <HomePage forecasts={forecasts} />;
}
