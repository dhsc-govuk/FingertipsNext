import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import Highcharts, { SymbolKeyValue } from 'highcharts';

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[]
): Highcharts.SeriesLineOptions[] {
  return data.map((item, index) => ({
    type: 'line',
    name: `${item.areaName}`,
    data: item.healthData.map((point) => [point.year, point.value]),
    marker: {
      symbol: symbols[index % symbols.length],
    },
  }));
}
