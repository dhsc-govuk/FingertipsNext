import { HealthDataForArea } from '@/generated-sources/ft-api-client';

import { filterDefined } from '@/lib/chartHelpers/filterDefined';

export const getMaxValue = (healthDataForAreas: HealthDataForArea[]) => {
  const values = healthDataForAreas.flatMap(
    (item) =>
      item.healthData
        .map((item) => item.value)
        .filter(filterDefined) as number[]
  );
  return Math.max(...values);
};
