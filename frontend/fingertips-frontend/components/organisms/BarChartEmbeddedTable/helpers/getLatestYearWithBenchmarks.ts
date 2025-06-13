import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export const getLatestYearWithBenchmarks = (
  healthDataForAreas: HealthDataForArea[],
  benchmarkData: HealthDataForArea | undefined,
  groupData: HealthDataForArea | undefined
) => {
  const healthData = [...healthDataForAreas];
  if (benchmarkData) healthData.push(benchmarkData);
  if (groupData) healthData.push(groupData);

  const allYears = healthData.flatMap((areaData) =>
    areaData.healthData.map((point) => point.year)
  );
  const uniqueYears = new Set(allYears);
  const descendingYears = [...uniqueYears].sort((a, b) => b - a);

  return descendingYears.find((year) => {
    return healthData.every((areaData) => {
      const isEmptyAreaOtherThanBenchmarkArea =
        areaData.healthData.length === 0 &&
        areaData.areaCode !== benchmarkData?.areaCode;

      if (isEmptyAreaOtherThanBenchmarkArea) {
        return true;
      }

      return areaData.healthData.some((point) => point.year === year);
    });
  });
};
