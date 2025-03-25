import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from './constants';

export function sortHealthDataForAreasByDate(
  data: HealthDataForArea[]
): HealthDataForArea[] {
  return data.map((area) => sortHealthDataForAreaByDate(area));
}

export function sortHealthDataForAreaByDate(
  data: HealthDataForArea
): HealthDataForArea {
  return {
    ...data,
    healthData: data.healthData.toSorted((a, b) => a.year - b.year),
  };
}

export function sortHealthDataByYearDescending(
  data: HealthDataForArea[] = []
): HealthDataForArea[] {
  return data.map((item) => ({
    ...item,
    healthData: sortHealthDataPointsByDescendingYear(item.healthData),
  }));
}

export function sortHealthDataPointsByDescendingYear(
  data: HealthDataPoint[] | undefined
): HealthDataPoint[] {
  if (!data) {
    return [];
  }
  return data.toSorted((a, b) => b.year - a.year);
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

export function seriesDataWithoutEnglandOrGroup(
  data: HealthDataForArea[],
  groupAreaCode?: string
) {
  return data.filter(
    (item) =>
      item.areaCode !== areaCodeForEngland && item.areaCode !== groupAreaCode
  );
}

export function getHealthDataWithoutInequalities(
  data: HealthDataForArea
): HealthDataPoint[] {
  return data?.healthData?.filter((data) => data.isAggregate);
}

export function isEnglandSoleSelectedArea(areasSelected?: string[]) {
  const distinctAreas = [...new Set(areasSelected)];
  return distinctAreas.length === 1 && distinctAreas[0] === areaCodeForEngland;
}

export function getMostRecentData(data: HealthDataPoint[]) {
  return data.length > 0
    ? {
        count: data[0].count,
        value: data[0].value,
        lowerCi: data[0].lowerCi,
        upperCi: data[0].upperCi,
        year: data[0].year,
      }
    : undefined;
}

export async function loadHighchartsModules(callback: () => void) {
  await import('highcharts/highcharts-more').then(callback);
}

export const getLatestYear = (
  points: HealthDataPoint[] | undefined
): number | undefined => {
  if (!points || points.length < 1) return undefined;

  const year = points.reduce((previous, point) => {
    return Math.max(previous, point.year);
  }, points[0].year);
  return year;
};

export function getHealthDataForAreasForMostRecentYearOnly(
  healthDataForAreas: HealthDataForArea[]
) {
  const mostRecentYear = healthDataForAreas.reduce((previous, area) => {
    return Math.max(previous, getLatestYear(area?.healthData) ?? 0);
  }, healthDataForAreas[0].healthData[0].year);

  const healthDataForAreasForMostRecentYear = healthDataForAreas.map(
    (healthDataForArea) => {
      const dataPointForMostRecentYear = healthDataForArea.healthData.find(
        (healthDataPoint) => {
          return healthDataPoint.year === mostRecentYear;
        }
      );
      if (dataPointForMostRecentYear) {
        return {
          ...healthDataForArea,
          healthData: [{ ...dataPointForMostRecentYear }],
        };
      } else {
        return { ...healthDataForArea, healthData: [] };
      }
    }
  );

  return healthDataForAreasForMostRecentYear;
}
