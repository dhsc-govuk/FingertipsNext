import Highcharts from 'highcharts';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from './constants';

export function sortHealthDataByDate(
  data: HealthDataForArea[]
): HealthDataForArea[] {
  return data.map((item) => ({
    ...item,
    healthData: item.healthData.toSorted((a, b) => a.year - b.year),
  }));
}

export function generateSeriesData(
  data: HealthDataForArea[],
  benchmarkData?: HealthDataForArea
): Highcharts.SeriesLineOptions[] {
  const seriesData = data.map<Highcharts.SeriesLineOptions>((item) => ({
    type: 'line',
    name: `${item.areaName}`,
    data: item.healthData.map((point) => [point.year, point.value]),
  }));

  if (benchmarkData) {
    const englandSeries: Highcharts.SeriesLineOptions = {
      type: 'line',
      name: 'Benchmark: England',
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

export function sortHealthDataByYearDescending(
  data: HealthDataForArea[] = []
): HealthDataForArea[] {
  return data.map((item) => ({
    ...item,
    healthData: item.healthData.toSorted((a, b) => b.year - a.year),
  }));
}

export function getEnglandDataForIndicatorIndex(
  data: HealthDataForArea[][],
  indicatorIndex: number
) {
  return data[indicatorIndex].find(
    (areaData) => areaData.areaCode === areaCodeForEngland
  );
}

export function seriesDataWithoutEngland(data: HealthDataForArea[]) {
  return data.filter((item) => item.areaCode !== areaCodeForEngland);
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

export const LIGHT_GREY = '#b1b4b6';
