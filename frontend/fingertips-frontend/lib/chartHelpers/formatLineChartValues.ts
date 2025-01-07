import { HealthCareData } from '@/app/chart/health-data';
import Highcharts from 'highcharts';

export function orderedValues(data: HealthCareData[]): HealthCareData[] {
  return data.map((item) => ({
    ...item,
    healthData: item.healthData.toSorted((a, b) => a.year - b.year),
  }));
}

export function generateSeriesData(
  data: HealthCareData[]
): Highcharts.SeriesLineOptions[] {
  return data.map((item) => ({
    type: 'line',
    name: `AreaCode ${item.areaCode}`,
    data: item.healthData.map((point) => [point.year, point.value]),
  }));
}
