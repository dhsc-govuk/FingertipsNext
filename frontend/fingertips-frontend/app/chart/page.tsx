import { Chart } from '@/components/pages/chart';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import { connection } from 'next/server';
import { WeatherForecastApi } from '@/generated-sources/api-client';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<{
      searchedIndicator?: string;
      indicatorsSelected?: string;
    }>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator = searchParams?.searchedIndicator;
  const indicatorsSelected = searchParams?.indicatorsSelected?.split(',') ?? [];
  // We don't want to render this page statically
  await connection();

  const config = getApiConfiguration();
  const forecastApi = new WeatherForecastApi(config);
  const data = await forecastApi.getWeatherForecast();

  return (
    <Chart
      data={data}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
