import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from './constants';
import Highcharts from 'highcharts';

export function sortHealthDataByDate(
  data: HealthDataForArea[]
): HealthDataForArea[] {
  return data.map((item) => ({
    ...item,
    healthData: item.healthData.toSorted((a, b) => a.year - b.year),
  }));
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

export function showConfidenceIntervals(
  data: HealthDataForArea[]
): Highcharts.SeriesOptionsType[] {
  const r = data.map<Highcharts.SeriesOptionsType>((item) => ({
    type: 'errorbar',
    name: `${item.areaName}`,
    data: item.healthData.map((point) => [
      point.year,
      point.lowerCi,
      point.upperCi,
    ]),
  }));
  console.log('r ====', r )
  return r
}
