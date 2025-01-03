import { HealthCareData } from '@/app/chart/health-data';
import Highcharts from 'highcharts';

export function formatYearsForXAxis(data: HealthCareData[]) {
  const years = data.flatMap((item) =>
    item.healthData.map((point) => point.year)
  );
  const formatYear = years.map((year) => year.toString());
  return Array.from(new Set(formatYear)).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
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
