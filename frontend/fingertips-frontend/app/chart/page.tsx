import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import { SearchStateParams } from '@/lib/searchStateManager';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator = searchParams?.searchedIndicator;
  const indicatorsSelected = searchParams?.indicatorsSelected?.split(',') ?? [];
  const areaCodes = searchParams?.areasSelected?.split(',') ?? [];

  // We don't want to render this page statically
  await connection();

  const config = getApiConfiguration();
  const indicatorApi = new IndicatorsApi(config);
  const data = await indicatorApi.getHealthDataForAnIndicator({
    indicatorId: Number(searchedIndicator),
    areaCodes: areaCodes,
  });

  return (
    <Chart
      data={data}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
