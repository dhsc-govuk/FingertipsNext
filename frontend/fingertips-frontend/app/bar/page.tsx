import { connection } from 'next/server';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { Bar } from '@/components/pages/barChart';

export default async function BarChartPage(
  props: Readonly<{
    searchParams?: Promise<{
      indicator?: string;
    }>;
  }>
) {
  // We don't want to render this page statically
  await connection();
  const searchParams = await props.searchParams;
  const indicator = searchParams?.indicator;

  const config = getApiConfiguration();
  const indicatorApi = new IndicatorsApi(config);
  const data = await indicatorApi.getHealthDataForAnIndicator({
    indicatorId: Number(indicator),
  });
  return <Bar data={data} />;
}
