import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from './constants';
import { Sex } from '@/components/organisms/Inequalities/inequalitiesHelpers';

export function sortHealthDataByDate(
  data: HealthDataForArea[]
): HealthDataForArea[] {
  return data.map((item) => ({
    ...item,
    healthData: item.healthData
      .filter((healthPoint) => healthPoint.sex === Sex.ALL)
      .toSorted((a, b) => a.year - b.year),
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

export function seriesDataForIndicatorIndexAndArea(
  data: HealthDataForArea[][],
  indicatorIndex: number,
  seriesAreaCode: string
) {
  return data[indicatorIndex].find(
    (areaData) => areaData.areaCode === seriesAreaCode
  );
}

export function seriesDataWithoutEnglandOrParent(
  data: HealthDataForArea[],
  parentAreaCode?: string
) {
  return data.filter(
    (item) =>
      item.areaCode !== areaCodeForEngland && item.areaCode !== parentAreaCode
  );
}
