import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { allHealthPoints } from '@/lib/healthDataHelpers/allHealthPoints';
import {
  localeSort,
  sexCategory,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { isSexTypePresent } from '@/components/charts/Inequalities/helpers/isSexTypePresent';

export const inequalityTypeOptions = (
  healthData: IndicatorWithHealthDataForArea
): string[] => {
  const allDeprivationPoints = allHealthPoints(healthData).filter(
    (point) => !point.deprivation.isAggregate
  );

  const allDeprivationTypes = allDeprivationPoints.map(
    ({ deprivation }) => deprivation.type
  );

  const unique = [...new Set(allDeprivationTypes)];
  if (
    isSexTypePresent(healthData.areaHealthData?.at(0)?.indicatorSegments ?? [])
  ) {
    unique.push(sexCategory);
  }
  return unique.toSorted(localeSort);
};
