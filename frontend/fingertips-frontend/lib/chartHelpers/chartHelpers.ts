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

export const LIGHT_GREY = '#b1b4b6';
