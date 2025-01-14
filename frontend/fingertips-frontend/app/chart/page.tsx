import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import { AreasApi } from '@/generated-sources/ft-api-client';
import { mockPopulationData } from '@/mock/data/populationdata';

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
  const indicator = searchParams?.indicator;
  const indicatorsSelected = searchParams?.indicatorsSelected?.split(',') ?? [];
  const areaCodes = searchParams?.areaCodes?.split(',') ?? [];

  const config = getApiConfiguration();
  const indicatorApi = new IndicatorsApi(config);
  const data = await indicatorApi.getHealthDataForAnIndicator({
    indicatorId: Number(indicator),
    areaCodes: areaCodes,
  });

  const populationDataApi = new AreasApi(config);
  let populationData = await populationDataApi.areasPopulationDataGet({
    areaCodes: ['area'],
    years: [2023],
  });

  // populationData = mockPopulationData;

  return (
    <Chart
      data={data}
      populationData={populationData}
      indicator={indicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
