import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export const determineLatestDataPeriod = (
  areasHealthData: HealthDataForArea[],
  englandData: HealthDataForArea | null
): number | undefined => {
  const firstAreaHealthData = areasHealthData[0];
  const hasAreaHealthData = !!firstAreaHealthData?.healthData?.length;

  let latestDataPeriod: number | undefined;

  if (hasAreaHealthData) {
    const healthDataArr = firstAreaHealthData.healthData;
    latestDataPeriod = healthDataArr[healthDataArr.length - 1]?.year;
  } else if (englandData?.healthData?.length) {
    latestDataPeriod = englandData.healthData[0].year;
  } else {
    latestDataPeriod = undefined;
  }

  return latestDataPeriod;
};
