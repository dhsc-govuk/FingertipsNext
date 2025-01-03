import { HealthCareData } from '@/app/chart/health-data';
import Highcharts from 'highcharts';

export function formatYearsForXAxis(data: HealthCareData[]) {
  const years = data.flatMap((item) =>
    item.healthData.map((point) => point.year)
  );
  const orderYears = Array.from(new Set(years)).sort((a, b) => a - b);
  return orderYears.map((year) => year.toString());
}

export function generateSeriesData(
  data: HealthCareData[]
): Highcharts.SeriesLineOptions[] {
  return data.map((item) => ({
    type: 'line',
    name: `AreaCode ${item.areaCode}`,
    data: item.healthData.map((point) => point.value),
  }));
}
