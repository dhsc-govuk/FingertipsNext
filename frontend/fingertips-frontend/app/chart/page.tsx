import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { getApiConfiguration } from '@/lib/getApiConfiguration';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<{
      indicator?: string;
      areaCode?: string;
    }>;
  }>
) {
  // We don't want to render this page statically
  await connection();

  const searchParams = await props.searchParams;
  const indicator = searchParams?.indicator ?? '';
  const areaCode = searchParams?.areaCode ?? '';
  
  const config = getApiConfiguration();
  const indicatorApi = new IndicatorsApi(config);
  const data = await indicatorApi.getHealthDataForAnIndicator({indicatorId: Number(indicator), areaCodes: [areaCode]});

  return <Chart data={data} />;
}