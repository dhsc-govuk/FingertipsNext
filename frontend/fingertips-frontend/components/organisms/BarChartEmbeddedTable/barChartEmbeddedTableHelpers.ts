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
  healthDataForAreas: HealthDataForArea[],
  benchmarkData: HealthDataForArea | undefined,
  groupData: HealthDataForArea | undefined,
) => {
  const healthData = [...healthDataForAreas];
  if (benchmarkData) healthData.push(benchmarkData);
  if (groupData) healthData.push(groupData);

  const allYears = healthData
    .flatMap((areaData) => areaData?.healthData.map((point) => point.year))
    .filter(filterUndefined) as number[];
  const uniqueYears = new Set(allYears);
  const descendingYears = [...uniqueYears].sort((a, b) => b - a);

  return descendingYears.find((year) => {
    return healthData.every((areaData) => {
      return (
        (areaData.healthData.length === 0 && areaData.areaCode !== benchmarkData?.areaCode) ||
        areaData.healthData.some((point) => point.year === year)
      );
    });
  });
};
