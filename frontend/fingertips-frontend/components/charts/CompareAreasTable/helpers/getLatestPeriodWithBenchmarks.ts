import {
  DatePeriod,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { determineUniquePeriods } from '@/components/charts/CompareAreasTable/helpers/determineUniquePeriods';

export const getLatestPeriodWithBenchmarks = (
  healthDataForAreas: HealthDataForArea[],
  englandData: HealthDataForArea | undefined,
  groupData: HealthDataForArea | undefined,
  benchmarkToUse: string
) => {
  const healthData = [...healthDataForAreas];
  if (englandData && englandData.healthData.length > 0)
    healthData.push(englandData);
  if (groupData && groupData.healthData.length > 0) healthData.push(groupData);

  const allPeriods = healthData.flatMap((areaData) =>
    areaData.healthData.map((point) => point.datePeriod)
  );

  const definePeriods = allPeriods.filter(
    (period): period is DatePeriod => period !== undefined
  );
  const uniquePeriods = determineUniquePeriods(definePeriods);

  const descendingPeriods = [...uniquePeriods].sort(
    (a, b) => convertDateToNumber(b?.to) - convertDateToNumber(a?.to)
  );

  const benchmarkData =
    benchmarkToUse === areaCodeForEngland ? englandData : groupData;

  return descendingPeriods.find((datePeriod) => {
    return healthData.every((areaData) => {
      const isEmptyAreaOtherThanBenchmarkArea =
        areaData.healthData.length === 0 &&
        areaData.areaCode !== benchmarkData?.areaCode;

      if (isEmptyAreaOtherThanBenchmarkArea) {
        return true;
      }

      return areaData.healthData.some(
        (point) =>
          convertDateToNumber(point.datePeriod?.to) ===
          convertDateToNumber(datePeriod?.to)
      );
    });
  });
};
