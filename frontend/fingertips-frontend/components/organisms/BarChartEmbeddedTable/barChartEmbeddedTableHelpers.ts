import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  RecentTrend = 'Recent trend',
  Period = 'Period',
  Count = 'Count',
  Value = 'Value',
  Lower = 'Lower',
  Upper = 'Upper',
}

export const chartName = 'barChartEmbeddedTable';
export const barChartEmbeddedRowClassName = 'barChartEmbeddedTableRow';

export const filterUndefined = (value: unknown) => value !== undefined;

export const getMaxValue = (healthDataForAreas: HealthDataForArea[]) => {
  const values = healthDataForAreas.flatMap(
    (item) =>
      item.healthData
        .map((item) => item.value)
        .filter(filterUndefined) as number[]
  );
  return Math.max(...values);
};

export const getFirstCompleteYear = (
  healthDataForAreas: (HealthDataForArea | undefined)[]
) => {
  const filteredHealthDataForAreas = healthDataForAreas.filter(
    filterUndefined
  ) as HealthDataForArea[];

  const allYears = filteredHealthDataForAreas
    .flatMap((areaData) => areaData?.healthData.map((point) => point.year))
    .filter(filterUndefined) as number[];
  const allUniqueYears = new Set(allYears);
  const sortedUniqueYears = [...allUniqueYears].sort((a, b) => b - a);
  return sortedUniqueYears.find((year) => {
    return filteredHealthDataForAreas.every((areaData) => {
      return areaData?.healthData.some((point) => point.year === year);
    });
  });
};
