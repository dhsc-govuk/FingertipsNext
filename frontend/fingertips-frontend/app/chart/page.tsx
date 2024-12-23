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
  };
}

export default async function ChartPage() {
  // We don't want to render this page statically
  await connection();

  // const config = getApiConfiguration();
  // const forecastApi = new WeatherForecastApi(config);
  const endpoint = getGetHealthDataForAnIndicator200Response();
  const data: HealthCareData[] = endpoint.map((item => ({
    areaCode: item.areaCode,
    healthData: item.healthData
  })))

  return <Chart data={data} />;
}
