import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { getGetHealthDataForAnIndicator200Response } from '@/mock/server/handlers';

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

  const endpoint = getGetHealthDataForAnIndicator200Response();

  // const data: HealthCareData[] = endpoint.map((item) => ({
  //   areaCode: item.areaCode,
  //   healthData: item.healthData,
  // }));
  
  const data = endpoint
    .filter((item) => areaCode === '' || item.areaCode === areaCode)
    .map((item) => ({
      areaCode: item.areaCode,
      healthData: item.healthData,
    }));

  return <Chart data={data} />;
}
