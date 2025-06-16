import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const getLatestYearWithBenchmarks = (
  healthDataForAreas: HealthDataForArea[],
  englandData: HealthDataForArea | undefined,
  groupData: HealthDataForArea | undefined,
  benchmarkToUse: string
) => {
  const healthData = [...healthDataForAreas];
  if (englandData && englandData.healthData.length > 0)
    healthData.push(englandData);
  if (groupData && groupData.healthData.length > 0) healthData.push(groupData);

  const allYears = healthData.flatMap((areaData) =>
    areaData.healthData.map((point) => point.year)
  );

  const uniqueYears = new Set(allYears);

  const descendingYears = [...uniqueYears].sort((a, b) => b - a);

  const benchmarkData =
    benchmarkToUse === areaCodeForEngland ? englandData : groupData;

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
