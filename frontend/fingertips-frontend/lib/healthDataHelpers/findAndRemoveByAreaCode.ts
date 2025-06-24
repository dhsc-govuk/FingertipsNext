import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export const findAndRemoveByAreaCode = (
  healthData: HealthDataForArea[],
  areaCode?: string
): [HealthDataForArea[], HealthDataForArea | undefined] => {
  const foundAreaIndex = healthData.findIndex(
    (item) => item.areaCode === areaCode
  );

  if (foundAreaIndex === -1) return [healthData, undefined];

  const healthDataCopy = [...healthData];
  const [foundArea] = healthDataCopy.splice(foundAreaIndex, 1);

  return [healthDataCopy, foundArea];
};
