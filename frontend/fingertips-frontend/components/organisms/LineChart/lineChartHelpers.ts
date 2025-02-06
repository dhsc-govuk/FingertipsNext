import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import Highcharts, { SymbolKeyValue } from 'highcharts';

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[],
  benchmarkData?: HealthDataForArea
): Highcharts.SeriesLineOptions[] {
  const seriesData = data.map<Highcharts.SeriesLineOptions>((item, index) => ({
    type: 'line',
    name: `${item.areaName}`,
    data: item.healthData.map((point) => [point.year, point.value]),
    marker: {
      symbol: symbols[index % symbols.length],
    },
  }));

  if (benchmarkData) {
    const englandSeries: Highcharts.SeriesLineOptions = {
      type: 'line',
      name: `Benchmark: ${benchmarkData.areaName}`,
      data: benchmarkData.healthData.map((point) => [point.year, point.value]),
      color: 'black',
      marker: {
        symbol: 'circle',
      },
    };
    seriesData.unshift(englandSeries);
  }

  return seriesData;
}
