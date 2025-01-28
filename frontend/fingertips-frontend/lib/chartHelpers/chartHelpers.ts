import Highcharts from 'highcharts';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export function sortHealthDataByDate(
  data: HealthDataForArea[]
): HealthDataForArea[] {
  return data.map((item) => ({
    ...item,
    healthData: item.healthData.toSorted((a, b) => a.year - b.year),
  }));
}

export function generateSeriesData(
  data: HealthDataForArea[]
): Highcharts.SeriesLineOptions[] {
  return data.map((item) => ({
    type: 'line',
    name: `${item.areaName}`,
    data: item.healthData.map((point) => [point.year, point.value]),
  }));
}

export enum LineChartTableHeadingEnum {
  AreaPeriod = 'Period',
  AreaTrend = 'Trend',
  AreaCount = 'Count',
  AreaValue = 'Value',
  AreaLower = 'Lower',
  AreaUpper = 'Upper',
  BenchmarkValue = 'Value ',
}

export const LIGHT_GREY = '#b1b4b6';
