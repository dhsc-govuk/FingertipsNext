import { Chart } from '@/components/pages/chart';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import { connection } from 'next/server';
import { WeatherForecastApi } from '@/generated-sources/api-client';
import { getGetHealthDataForAnIndicator200Response } from '@/mock/server/handlers';

interface HealthCareData {
  areaCode: string;
  healthData: {
    year: number;
    count: number;
    value: number;
    lowerCi: number;
    upperCi: number;
  }[];
}

export default async function ChartPage(props: Readonly<{
  searchParams?: Promise<{
    indicator?: string;
  }>
}> ) {
  // We don't want to render this page statically
  await connection();

  const searchParams = await props.searchParams;
  const indicator = searchParams?.indicator ?? '';

  const endpoint = getGetHealthDataForAnIndicator200Response();
  
  // TODO - Get filtered area code data
  // const data = endpoint.filter(( item => item.areaCode === areaCode))
 
  const data: HealthCareData[] = endpoint.map((item) => ({
    areaCode: item.areaCode,
    healthData: item.healthData.map((item ) => ({year: item.year,
      count: item.count,
      value: item.value,
      lowerCi: item.lowerCi,
      upperCi: item.upperCi
    }))
  }));

  return <Chart data={data} />;
}
