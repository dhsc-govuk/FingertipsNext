import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import Highcharts, { SymbolKeyValue } from 'highcharts';
import { ChartColours } from '@/lib/chartHelpers/colours';

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[],
  chartColours: ChartColours[],
  benchmarkData?: HealthDataForArea,
  parentIndicatorData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean
) {
  const seriesData: Highcharts.SeriesOptionsType[] = data.flatMap(
    (item, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = {
        type: 'line',
        name: `${item.areaName}`,
        data: item.healthData.map((point) => [point.year, point.value]),
        marker: {
          symbol: symbols[index % symbols.length],
        },
        color: chartColours[index % chartColours.length],
      };

      const confidenceIntervalSeries: Highcharts.SeriesOptionsType = {
        type: 'errorbar',
        name: `${item.areaName}`,
        data: item.healthData.map((point) => [
          point.year,
          point.lowerCi,
          point.upperCi,
        ]),
        visible: showConfidenceIntervalsData,
        color: '#B1B4B6',
        whiskerLength: '20%',
        lineWidth: 2,
      };

      return [lineSeries, confidenceIntervalSeries];
    }
  );

  if (parentIndicatorData) {
    const groupSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: `Group: ${parentIndicatorData.areaName}`,
      data: parentIndicatorData.healthData.map((point) => [
        point.year,
        point.value,
      ]),
      color: 'green',
      marker: {
        symbol: 'diamond',
      },
    };
    seriesData.unshift(groupSeries);
  }

  if (benchmarkData) {
    const englandSeries: Highcharts.SeriesOptionsType = {
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

export function shouldDisplayLineChart(
  data: HealthDataForArea[],
  indicatorsSelected: string[],
  areasSelected: string[]
): boolean {
  return (
    indicatorsSelected.length === 1 &&
    areasSelected.length <= 2 &&
    data[0]?.healthData.length > 1
  );
}

export enum LineChartTableHeadingEnum {
  AreaPeriod = 'Period',
  BenchmarkTrend = 'Compared to benchmark',
  AreaCount = 'Count',
  AreaValue = 'Value',
  AreaLower = 'Lower',
  AreaUpper = 'Upper',
  BenchmarkValue = 'Value ',
}
