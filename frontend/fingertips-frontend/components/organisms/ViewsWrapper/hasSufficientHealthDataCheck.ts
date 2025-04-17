import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

const hasSufficientAreaHealthData = (
  indicatorDataForArea: IndicatorWithHealthDataForArea,
  areasSelected: string[]
): boolean => {
  if (indicatorDataForArea.areaHealthData) {
    return indicatorDataForArea.areaHealthData.reduce<boolean>(
      (hasSufficientAreaHealthData, areaHealthData) => {
        const hasAreaSelectedHealthData = areasSelected?.find(
          (areaSelected) =>
            areaSelected === areaHealthData.areaCode &&
            areaHealthData.healthData.length > 1
        );

        if (hasAreaSelectedHealthData) {
          return true;
        }
        return hasSufficientAreaHealthData;
      },
      false
    );
  }
  return false;
};

export const hasSufficientHealthDataCheck = (
  indicatorsDataForAreas: IndicatorWithHealthDataForArea[] = [],
  areasSelected: string[] = []
): boolean => {
  const hasHealthDataForAllSelectedAreasAndIndicators = indicatorsDataForAreas
    ?.map((indicatorData) => {
      return hasSufficientAreaHealthData(indicatorData, areasSelected);
    })
    .some(
      (hasNoHealthDataForAllSelectedArea) => hasNoHealthDataForAllSelectedArea
    );

  return hasHealthDataForAllSelectedAreasAndIndicators;
};
