import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { getApiConfiguration } from '@/lib/getApiConfiguration';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<{
      indicator?: string;
      indicatorsSelected?: string;
      areaCodes?: string;
    }>;
  }>
) {
  // We don't want to render this page statically
  await connection();

  const searchParams = await props.searchParams;
  const indicator = searchParams?.indicator ?? '';
  const indicatorsSelected = searchParams?.indicatorsSelected?.split(',') ?? [];
  const areaCodes = searchParams?.areaCodes ?? '';
  
  const config = getApiConfiguration();
  const indicatorApi = new IndicatorsApi(config);
  const data = await indicatorApi.getHealthDataForAnIndicator({
    indicatorId: Number(indicator),
    areaCodes: [areaCodes],
  });
  
  const filteredData = data
  .filter((item) => areaCodes === '' || item.areaCode === areaCodes)
  .map((item) => ({
    areaCode: item.areaCode,
    healthData: item.healthData,
  }));

  return (
    <Chart
      data={filteredData}
      indicator={indicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
